import pnpm from '@pnpm/exec'
import consola from 'consola'
import { isWorkspaceClean } from './git'
import { fixDependencies, getDependencies, getDependents } from './dependencies'
import { packageFiles } from './files'

async function promptToContinue(workspace: string): Promise<boolean> {
  const message = `${workspace} workspace ${packageFiles.join(' or ')} file modified.\nWanna continue release?`
  return consola.prompt(message, {
    type: 'confirm',
  })
}

async function checkWorkspaceToContinue(workspace: string) {
  return isWorkspaceClean(workspace)
    || await promptToContinue(workspace)
}

async function releasePackage(pkg: string): Promise<boolean> {
  try {
    await pnpm(['--filter', pkg, 'release'])
    return true
  }
  catch (error) {
    consola.error(`Error in ${pkg} release`, (error as Error).message)
    return false
  }
}

export async function releaseWorkspace(workspace: string, releaseDependencies: boolean) {
  if (!await checkWorkspaceToContinue(workspace)) {
    consola.warn(`${workspace} skipped`)
    return false
  }

  const dependencies = getDependencies(workspace)
  if (releaseDependencies) {
    if (dependencies.length) {
      consola.log(` ${dependencies.length} workspace dependencies found:\n  - ${dependencies.map(d => d.name).join('\n  - ')}`)
      for (const dependency of dependencies) {
        dependency.released = await releaseWorkspace(dependency.name, releaseDependencies)
        dependency.fixed = await fixDependencies(workspace, dependency.name)
      }
    }
  }
  if (!!releaseDependencies || dependencies.every(({ released, fixed }) => released && fixed)) {
    await releasePackage(workspace)
    return true
  }
  else {
    consola.error('Some workspace release or fix failed. Aborting...')
    return false
  }
}

export async function releaseWorkspaces(workspaces: string[], releaseDependencies: boolean) {
  for (const workspace of workspaces) {
    consola.info('Release workspace:', workspace)
    await releaseWorkspace(workspace, releaseDependencies)
  }
}

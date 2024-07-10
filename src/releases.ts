import pnpm from '@pnpm/exec'
import consola from 'consola'
import { isWorkspaceClean } from './git'
import { fixDependencies, getDependencies, getDependents, getDependentsWithoutWorkspaces } from './dependencies'
import { packageFiles } from './files'
import { getNewVersion } from './versions'

async function promptToContinue(workspace: string): Promise<boolean> {
  const message = `${workspace} workspace ${packageFiles.join(' or ')} file modified.\nWanna continue release?`
  return consola.prompt(message, { type: 'confirm' })
}

async function promptToReleaseDependent(dependent: string, dependency: string): Promise<boolean> {
  const newVersion = getNewVersion(dependency, dependent)
  if (!newVersion)
    return false

  const message = `${dependent} dependent of ${dependency}.\nWanna fix ${dependent}?`
  return consola.prompt(message, { type: 'confirm' })
}

async function promptToReleaseWorkspace(workspace: string): Promise<boolean> {
  const message = `Wanna create a release from ${workspace}?`
  return consola.prompt(message, { type: 'confirm' })
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

export async function releaseWorkspace(workspace: string, releaseDependencies: boolean, workspaces: string[], release?: boolean) {
  workspaces = workspaces.concat(workspace)
  if (!await checkWorkspaceToContinue(workspace)) {
    consola.warn(`${workspace} skipped`)
    return false
  }

  const dependencies = getDependencies(workspace)
  if (releaseDependencies) {
    if (dependencies.length) {
      consola.log(` ${dependencies.length} workspace dependencies found:\n  - ${dependencies.map(d => d.name).join('\n  - ')}`)
      for (const dependency of dependencies) {
        dependency.released = await releaseWorkspace(dependency.name, releaseDependencies, workspaces, release)
        dependency.fixed = await fixDependencies(workspace, dependency.name)
      }
    }
  }

  if (!!releaseDependencies || dependencies.every(({ released, fixed }) => released && fixed)) {
    if (release === true || await promptToReleaseWorkspace(workspace)) {
      await releasePackage(workspace)
      const dependents = getDependentsWithoutWorkspaces(workspace, workspaces)
      for (const dependent of dependents) {
        if (await promptToReleaseDependent(dependent, workspace)) {
          await releaseWorkspace(dependent, releaseDependencies, workspaces)
        }
      }
    }
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
    await releaseWorkspace(workspace, releaseDependencies, workspaces, true)
  }
}

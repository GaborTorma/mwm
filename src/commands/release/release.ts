import consola from 'consola'
import { checkCancel } from '../../utils/args'
import { pnpmExec } from '../../utils/pnpm'
import { fixDependencies, getDependencies, getDependentsWithoutWorkspaces } from './dependencies'
import { packageFiles } from './files'
import { isWorkspaceClean } from './git'
import { getNewVersion } from './versions'

async function confirmMessage(message: string): Promise<boolean> {
  const result = await consola.prompt(message, {
    type: 'confirm',
  })
  checkCancel(result)
  return result
}

async function promptToContinue(workspace: string): Promise<boolean> {
  const message = `${workspace} workspace ${packageFiles.join(' or ')} file modified.\nWanna continue release?`
  return confirmMessage(message)
}

async function promptToReleaseDependent(dependent: string, dependency: string): Promise<boolean> {
  const newVersion = getNewVersion(dependency, dependent)
  if (!newVersion)
    return false

  const message = `${dependent} dependent of ${dependency}.\nWanna fix ${dependent}?`
  return confirmMessage(message)
}

async function promptToReleaseWorkspace(workspace: string): Promise<boolean> {
  const message = `Wanna create a release from ${workspace}?`
  return confirmMessage(message)
}

async function checkWorkspaceToContinue(workspace: string) {
  return isWorkspaceClean(workspace)
    || await promptToContinue(workspace)
}

function releasePackage(pkg: string) {
  pnpmExec(['--filter', pkg, 'release'])
}

export async function releaseWorkspace(workspace: string, releaseDependencies: boolean, workspaces: Set<string>, release?: boolean) {
  if (!await checkWorkspaceToContinue(workspace)) {
    consola.warn(`${workspace} skipped`)
    return
  }

  if (releaseDependencies) {
    const dependencies = getDependencies(workspace)
    if (dependencies.length) {
      consola.log(` ${dependencies.length} workspace dependencies found:\n  - ${dependencies.join('\n  - ')}`)
      for (const dependency of dependencies) {
        await releaseWorkspace(dependency, releaseDependencies, workspaces, release)
        await fixDependencies(workspace, dependency)
      }
    }
  }

  if (release === true || await promptToReleaseWorkspace(workspace)) {
    releasePackage(workspace)
    workspaces.delete(workspace)
    const dependents = getDependentsWithoutWorkspaces(workspace, workspaces)
    for (const dependent of dependents) {
      if (await promptToReleaseDependent(dependent, workspace)) {
        workspaces.add(dependent)
        // await releaseWorkspace(dependent, releaseDependencies, workspaces)
      }
    }
  }
}

export async function releaseWorkspaces(workspaces: Set<string>, releaseDependencies: boolean) {
  for (const workspace of workspaces) {
    consola.info('Release workspace:', workspace)
    try {
      await releaseWorkspace(workspace, releaseDependencies, workspaces, true)
    }
    catch (error) {
      consola.error(`Some dependencies failed to fix or release for ${workspace}`, error)
    }
  }
}

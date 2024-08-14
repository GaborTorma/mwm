import { createDependencyMap, getPackageInfos } from 'workspace-tools'
import consola from 'consola'
import { pnpmExec } from '../../utils/pnpm'
import { commitChanges } from './git'
import { getNewVersion } from './versions'

function updateDeps(workspace: string, pkg: string, pkgVersion: string) {
  pnpmExec(['--filter', workspace, 'update', `${pkg}@${pkgVersion}`])
}

export async function fixDependencies(workspace: string, pkg: string) {
  const newVersion = getNewVersion(pkg, workspace)
  if (!newVersion) {
    consola.log(`There are no new version from ${pkg}`)
    return
  }
  consola.log(`New version found from ${pkg}:`, newVersion)
  updateDeps(workspace, pkg, newVersion)
  commitChanges(workspace, pkg, newVersion)
}

function getDependencyMap() {
  return createDependencyMap(getPackageInfos('.'))
}

export function getDependencies(workspace: string): string[] {
  const dependencies = getDependencyMap().dependencies.get(workspace)
  return Array.from(dependencies || [])
}

export function getDependents(pkg: string): string[] {
  const dependents = getDependencyMap().dependents.get(pkg)
  return Array.from(dependents || [])
}

export function getDependentsWithoutWorkspaces(pkg: string, workspaces: Set<string>): string[] {
  return getDependents(pkg)
    .filter(dependent => !workspaces.has(dependent))
}

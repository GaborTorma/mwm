import pnpm from '@pnpm/exec'
import { createDependencyMap, getPackageInfos, git } from 'workspace-tools'
import consola from 'consola'
import { getNewVersion } from './versions'
import { commitChanges } from './git'

async function updateDeps(workspace: string, pkg: string, pkgVersion: string) {
  try {
    await pnpm(['--filter', workspace, 'update', `${pkg}@${pkgVersion}`])
  }
  catch (error) {
    consola.error('Error in updateWorkspaceDeps', (error as Error).message)
  }
}

export async function fixDependencies(workspace: string, pkg: string): Promise<boolean> {
  const newVersion = getNewVersion(pkg, workspace)
  if (!newVersion) {
    consola.log(`There are no new version from ${pkg}`)
    return true
  }
  consola.log(`New version found from ${pkg}:`, newVersion)
  try {
    await updateDeps(workspace, pkg, newVersion)
    commitChanges(workspace, pkg, newVersion)
    return true
  }
  catch (error) {
    consola.error('Error in fix-mismatches', (error as Error).message)
    return false
  }
}

interface Dependency {
  name: string
  released?: boolean
  fixed?: boolean
  skipped?: boolean
}

export function getDependencies(workspace: string): Dependency[] {
  const dependencyMap = createDependencyMap(getPackageInfos('.'))
  const dependencies = dependencyMap.dependencies.get(workspace)
  return Array.from(dependencies || [], (name) => {
    return { name }
  })
}

export function getDependents(pkg: string): string[] {
  const dependencyMap = createDependencyMap(getPackageInfos('.'))
  const dependents = dependencyMap.dependents.get(pkg)
  return Array.from(dependents || [])
}

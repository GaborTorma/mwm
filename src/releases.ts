import { execSync } from 'node:child_process'
import path from 'node:path'
import { compareVersions } from 'compare-versions'
import type { PackageInfo } from 'workspace-tools'
import { createDependencyMap, getPackageInfos, git } from 'workspace-tools'
import consola from 'consola'
import PkgJson from '@npmcli/package-json'
import { processGitOutput } from './utils'

const files = ['package.json', 'pnpm-lock.yaml']

function hasOldVersion(dependencies: PackageInfo['dependencies'], pkg: string, version: string): boolean {
  if (!dependencies?.[pkg])
    return false

  return compareVersions(dependencies[pkg], version) < 0
}

function hasOldVersionInPackageInfo({ dependencies, devDependencies, peerDependencies }: PackageInfo, pkg: string, version: string): boolean {
  return [dependencies, devDependencies, peerDependencies]
    .some(deps => hasOldVersion(deps, pkg, version))
}

function getNewVersion(pkg: string, workspace: string): string | undefined {
  const packageInfos = getPackageInfos('.')
  const { version: pkgVersion } = packageInfos[pkg]
  if (hasOldVersionInPackageInfo(packageInfos[workspace], pkg, pkgVersion)) {
    return pkgVersion
  }
}

function getWorkspaceCwd(workspace: string): string {
  const packageInfos = getPackageInfos('.')
  return path.dirname(packageInfos[workspace].packageJsonPath)
}

async function updateWorkspaceDeps(pkg: string, pkgVersion: string, cwd: string) {
  const pkgJson = await PkgJson.load(cwd)
  if (pkgJson.content.dependencies?.[pkg])
    pkgJson.content.dependencies[pkg] = pkgVersion
  if (pkgJson.content.devDependencies?.[pkg])
    pkgJson.content.devDependencies[pkg] = pkgVersion
  if (pkgJson.content.peerDependencies?.[pkg])
    pkgJson.content.peerDependencies[pkg] = pkgVersion
  pkgJson.update(pkgJson.content)
  await pkgJson.save()
}

function installDependencies(workspace: string) {
  consola.log(`Installing dependencies for ${workspace}...`)
  execSync(`pnpm install --filter ${workspace}`)
  consola.info(`Dependencies installed for ${workspace}`)
}

function commitChanges(pkg: string, newVersion: string, cwd: string) {
  git(['add', ...files], { cwd })
  git(['commit', '-m', `packages(upgrade): ${pkg} v${newVersion}`], { cwd })
}

async function fixDependencies(pkg: string, releaseDependencies: boolean, workspace: string = pkg): Promise<boolean> {
  const newVersion = getNewVersion(pkg, workspace)
  if (!newVersion) {
    consola.log(`No new version from ${pkg}`)
    return true
  }
  consola.log(`New version from ${pkg}:`, newVersion)
  try {
    const cwd = getWorkspaceCwd(workspace)
    await updateWorkspaceDeps(pkg, newVersion, cwd)
    installDependencies(workspace)
    commitChanges(pkg, newVersion, cwd)
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

function getDependencies(workspace: string): Dependency[] {
  const dependencyMap = createDependencyMap(getPackageInfos('.'))
  const dependencies = dependencyMap.dependencies.get(workspace)
  return Array.from(dependencies || [], (name) => {
    return { name }
  })
}

function isFilesCleanByCwd(cwd: string): boolean {
  const output = processGitOutput(git(['status', '--porcelain'], { cwd }))
  const isClean = output.length === 0
  return isClean
}

function getPackageCwd(pkg: string): string {
  const packageInfos = getPackageInfos('.')
  const packageInfo = packageInfos[pkg]
  return path.dirname(packageInfo.packageJsonPath)
}

function isWorkspaceClean(workspace: string): boolean {
  const cwd = getPackageCwd(workspace)
  return isFilesCleanByCwd(cwd)
}

async function promptToContinue(workspace: string): Promise<boolean> {
  const message = `${workspace} workspace ${files.join(' or ')} file modified.\nWanna continue release?`
  return consola.prompt(message, { type: 'confirm' })
}

async function checkWorkspaceToContinue(workspace: string) {
  return isWorkspaceClean(workspace) || await promptToContinue(workspace)
}

function releasePackage(pkg: string): boolean {
  try {
    execSync(`pnpm --filter ${pkg} release`, { stdio: 'inherit' })
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
        dependency.fixed = await fixDependencies(dependency.name, releaseDependencies, workspace)
      }
    }
  }
  if (!!releaseDependencies || dependencies.every(({ released, fixed }) => released && fixed)) {
    releasePackage(workspace)
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

import type Buffer from 'node:buffer'
import type { SpawnSyncReturns } from 'node:child_process'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { readPackageJson } from '@pnpm/read-package-json'
import { createDependencyMap, getPackageInfos } from 'workspace-tools'
import consola from 'consola'
import { stdoutToArray } from './utils'

const files = ['package.json', 'pnpm-lock.yaml']

function getNewVersion(pkg: string): string | undefined {
  try {
    execSync(`syncpack list-mismatches --filter '${pkg}'`)
  }
  catch (error) {
    const stdout = (error as SpawnSyncReturns<Buffer>)?.stdout
    return stdoutToArray(stdout)?.filter(v => v.startsWith(`✘ ${pkg}`))?.[0]?.split(' ')?.[4]
  }
}

function fixPackageJsons(pkg: string): string[] {
  const stdout = execSync(`syncpack fix-mismatches --filter '${pkg}'`)
  return stdoutToArray(stdout).filter(v => v.startsWith('✓')).map(v => v.replace(/✓ /, ''))
}

interface Package {
  cwd: string
  packageJson: string
  name: string
}

async function getPackages(fixedPackageJsons: string[]): Promise<Package[]> {
  const packages: Package[] = []
  for (const fixedPackageJson of fixedPackageJsons) {
    const { name } = await readPackageJson(fixedPackageJson)
    packages.push({
      cwd: path.dirname(fixedPackageJson),
      packageJson: fixedPackageJson,
      name,
    })
  }
  return packages
}

function installDependencies(fixedPackage: Package) {
  consola.log(`Installing dependencies for ${fixedPackage.name}...`)
  execSync(`pnpm install --filter ${fixedPackage.name}`)
  consola.info(`Dependencies installed for ${fixedPackage.name}`)
}

function commitChanges(pkg: string, newVersion: string, cwd: string) {
  execSync(`git add ${files.join(' ')}`, { cwd })
  execSync(`git commit -m "packages(upgrade): ${pkg} v${newVersion}"`, { cwd })
}

async function fixDependencies(pkg: string) {
  const newVersion = getNewVersion(pkg)
  if (!newVersion) {
    consola.log(`No new version from ${pkg}`)
    return true
  }
  consola.log(`New version from ${pkg}:`, newVersion)
  try {
    const fixedPackageJsons = fixPackageJsons(pkg)
    const fixedPackages = await getPackages(fixedPackageJsons)
    for (const fixedPackage of fixedPackages) {
      installDependencies(fixedPackage)
      commitChanges(pkg, newVersion, fixedPackage.cwd)
    }
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
  const stdout = execSync('git status --porcelain', { cwd })
  const stdArr = stdoutToArray(stdout)
  for (const file of files) {
    for (const line of stdArr) {
      if (new RegExp(`\\s${file}$`).test(line)) {
        return false
      }
    }
  }
  return true
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

function releasePackage(pkg: string) {
  try {
    execSync(`pnpm --filter ${pkg} release`, { stdio: 'inherit' })
  }
  catch (error) {
    consola.error(`Error in ${pkg} release`, (error as Error).message)
  }
}

export async function release(workspace: string, releaseDependencies: boolean) {
  if (!await checkWorkspaceToContinue(workspace)) {
    consola.warn(`${workspace} skipped`)
    return
  }

  const dependencies = getDependencies(workspace)
  if (releaseDependencies) {
    consola.log(` ${dependencies.length} workspace dependencies found:\n  - ${dependencies.map(d => d.name).join('\n  - ')}`)
    for (const dependency of dependencies) {
      if (!await checkWorkspaceToContinue(dependency.name)) {
        consola.warn(`${dependency.name} skipped`)
        dependency.skipped = true
        return false
      }
      // dependency.released = releaseWorkspace(dependency.name)
      dependency.fixed = await fixDependencies(dependency.name)
    }
    if (dependencies.every(({ released, fixed }) => released && fixed)) {
      releasePackage(workspace)
    }
    else {
      consola.error('Some workspace dependencies failed to release or fix. Aborting...')
    }
  }
  else {
    releasePackage(workspace)
  }
}

export async function releaseWorkspaces(workspaces: string[], releaseDependencies: boolean) {
  for (const workspace of workspaces) {
    consola.info('Release workspace:', workspace)
    await release(workspace, releaseDependencies)
  }
}

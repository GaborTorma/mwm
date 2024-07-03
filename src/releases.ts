import type Buffer from 'node:buffer'
import type { SpawnSyncReturns } from 'node:child_process'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { readPackageJson } from '@pnpm/read-package-json'
import { createDependencyMap, getPackageInfos, git } from 'workspace-tools'
import consola from 'consola'
import { processGitOutput, stdoutToArray } from './utils'

const files = ['package.json', 'pnpm-lock.yaml']

function getSourceArgs(pkg: string, workspace: string): string {
  const packageInfos = getPackageInfos('.')
  const sources = [
    packageInfos[pkg].packageJsonPath,
    packageInfos[workspace].packageJsonPath,
  ]
  const sourceArgs = sources.map(source => `--source ${source}`).join(' ')
  return sourceArgs
}

function getNewVersion(pkg: string, workspace: string): string | undefined {
  try {
    const sourceArgs = getSourceArgs(pkg, workspace)
    execSync(`syncpack list-mismatches --filter '${pkg}' ${sourceArgs}`)
  }
  catch (error) {
    const stdout = (error as SpawnSyncReturns<Buffer>)?.stdout
    return stdoutToArray(stdout)?.filter(v => v.startsWith(`✘ ${pkg}`))?.[0]?.split(' ')?.[4]
  }
}

function fixPackageJsons(pkg: string, workspace: string): string[] {
  const sourceArgs = getSourceArgs(pkg, workspace)
  const stdout = execSync(`syncpack fix-mismatches --filter '${pkg}' ${sourceArgs}`)
  return stdoutToArray(stdout).filter(v => v.startsWith('✓')).map(v => v.replace(/✓ /, ''))
}

interface Package {
  cwd: string
  packageJson: string
  name: string
}

async function getFixedPackages(fixedPackageJsons: string[]): Promise<Package[]> {
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
  git(['add', ...files], { cwd })
  git(['commit', '-m', `packages(upgrade): ${pkg} v${newVersion}`], { cwd })
}

async function fixDependencies(pkg: string, releaseDependencies: boolean, workspace: string = pkg) {
  const newVersion = getNewVersion(pkg, workspace)
  if (!newVersion) {
    consola.log(`No new version from ${pkg}`)
    return true
  }
  consola.log(`New version from ${pkg}:`, newVersion)
  try {
    const fixedPackageJsons = fixPackageJsons(pkg, workspace)
    const fixedPackages = await getFixedPackages(fixedPackageJsons)
    for (const fixedPackage of fixedPackages) {
      installDependencies(fixedPackage)
      // if (fixedPackage.name === workspace) {
      commitChanges(pkg, newVersion, fixedPackage.cwd)
      /* }
      else {
        await releaseWorkspace(fixedPackage.name, releaseDependencies)
      } */
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

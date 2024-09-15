import type { GitProcessOutput } from 'workspace-tools'
import path from 'node:path'
import { getPackageInfos, git } from 'workspace-tools'
import { packageFiles } from './files'

function processGitOutput(output: GitProcessOutput) {
  if (!output.success)
    return []

  return output.stdout
    .split(/\n/)
    .map(line => line.trim())
    .filter(line => !!line && !line.includes('node_modules'))
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

export function isWorkspaceClean(workspace: string): boolean {
  const cwd = getPackageCwd(workspace)
  return isFilesCleanByCwd(cwd)
}

export function commitChanges(workspace: string, pkg: string, newVersion: string) {
  const cwd = getPackageCwd(workspace)
  git(['add', ...packageFiles], { cwd })
  git(['commit', '-m', `packages(upgrade): ${pkg} v${newVersion}`], { cwd })
}

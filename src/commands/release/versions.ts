import type { PackageInfo } from 'workspace-tools'
import { compareVersions } from 'compare-versions'
import { getPackageInfos } from 'workspace-tools'

function hasOldVersion(dependencies: PackageInfo['dependencies'], pkg: string, version: string): boolean {
  if (!dependencies?.[pkg])
    return false

  return compareVersions(dependencies[pkg], version) < 0
}

function hasOldVersionInPackageInfo(packageInfo: PackageInfo, pkg: string, version: string): boolean {
  const { dependencies, devDependencies, peerDependencies } = packageInfo
  return [dependencies, devDependencies, peerDependencies]
    .some(deps => hasOldVersion(deps, pkg, version))
}

export function getNewVersion(pkg: string, workspace: string): string | undefined {
  const packageInfos = getPackageInfos('.')
  const { version: pkgVersion } = packageInfos[pkg]
  if (hasOldVersionInPackageInfo(packageInfos[workspace], pkg, pkgVersion)) {
    return pkgVersion
  }
}

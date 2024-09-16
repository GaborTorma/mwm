import type { PackageJson } from 'pkg-types'
import type { Repo } from './args'
import { join, resolve } from 'node:path'
import { readPackageJSON, writePackageJSON } from 'pkg-types'
import { replaceInFile } from 'replace-in-file'

export type ReplaceReplacement = { type: 'replace' }
  & Parameters<typeof replaceInFile>[0]

export type pkgReplacement = { type: 'pkg' }
  & { replace(packageJson: PackageJson, repo: Repo): PackageJson }

export type Replacement = ReplaceReplacement | pkgReplacement

export type Replacements = Replacement[]

export async function fixReplacements(replacements: Replacements, repo: Repo) {
  for (const replacement of replacements) {
    if (replacement.type === 'replace') {
      let files = replacement.files
      if (!Array.isArray(files)) {
        files = [files]
      }
      replacement.files = files.map((file => join('.', repo.path, file)))
      await replaceInFile(replacement)
    }
    else if (replacement.type === 'pkg') {
      const file = resolve('.', repo.path, 'package.json')
      const packageJson = await readPackageJSON(file)
      await writePackageJSON(file, replacement.replace(packageJson, repo))
    }
  }
}

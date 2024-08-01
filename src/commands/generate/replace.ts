import { join } from 'node:path'
import { replaceInFile } from 'replace-in-file'

export type Replacement = Parameters<typeof replaceInFile>[0]

export type Replacements = Replacement[]

export function fixFiles(replacements: Replacements, path: string) {
  for (const replacement of replacements) {
    let files = replacement.files
    if (!Array.isArray(files)) {
      files = [files]
    }
    replacement.files = files.map((file => join('.', path, file)))
  }
}

export async function replaceInFiles(replacements: Replacements) {
  for (const replacement of replacements) {
    await replaceInFile(replacement)
  }
}

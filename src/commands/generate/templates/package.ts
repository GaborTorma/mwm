import type { Repo } from '../args'
import type { Replacements } from '../replace'

export function getPackageReplacements(repo: Repo): Replacements {
  return [
    {
      files: ['package.json'],
      from: [
        /(?<="name": ").*(?=")/,
        /(?<="author": ").*(?=")/,
        /(?<="description": ").*(?=")/,
        /(?<="version": ").*(?=")/,
      ],
      to: [
        `@${repo.owner.id.toLowerCase()}/${repo.name}`,
        repo.owner.name || repo.owner.id,
        repo.description,
        '0.0.1',
      ],
    },
  ]
}

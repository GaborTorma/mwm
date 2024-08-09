import type { Repo } from '../args'
import type { Replacements } from '../replace'

export function getPackageReplacements(repo: Repo): Replacements {
  const fullRepo = `${repo.owner.id}/${repo.name}`
  return [
    {
      files: ['package.json'],
      from: [
        /(?<="name": ").*(?=")/,
        /(?<="author": ").*(?=")/,
        /(?<="description": ").*(?=")/,
        /(?<="version": ").*(?=")/,
        /(?<="url": ").*(?=")/,
        /(?<="homepage": ").*(?=")/,
        /(?<="bugs": ").*(?=")/,
      ],
      to: [
        `@${repo.owner.id.toLowerCase()}/${repo.name}`,
        repo.owner.name || repo.owner.id,
        repo.description,
        '0.0.1',
        `git+ssh://git@github.com/${fullRepo}.git`,
        `https://github.com/${fullRepo}`,
        `https://github.com/${fullRepo}/issues`,
      ],
    },
  ]
}

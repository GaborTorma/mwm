import type { Repo } from '../args'
import type { Replacement } from '../replace'
import type { Template } from '../templates'
import { camelCase, pascalCase } from 'change-case'

export function getReadmeReplacement(template: Template, repo: Repo): Replacement {
  return {
    type: 'replace',
    files: ['README.md'],
    from: [
      new RegExp(template.owner, 'gi'),
      new RegExp(template.repo, 'g'),
      new RegExp(camelCase(template.repo), 'g'),
      new RegExp(pascalCase(template.repo), 'g'),
      '_description_',
    ],
    to: [
      repo.owner.id.toLowerCase(),
      repo.name,
      camelCase(repo.name),
      pascalCase(repo.name),
      repo.description,
    ],
  }
}

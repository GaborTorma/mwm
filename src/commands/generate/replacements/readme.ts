import type { Repo } from '../args'
import type { Replacement } from '../replace'
import type { Template } from '../templates'

export function getReadmeReplacement(template: Template, repo: Repo): Replacement {
  return {
    type: 'replace',
    files: ['README.md'],
    from: [
      new RegExp(template.owner, 'gi'),
      new RegExp(template.repo, 'g'),
      '_description_',
    ],
    to: [
      repo.owner.id.toLowerCase(),
      repo.name,
      repo.description,
    ],

  }
}

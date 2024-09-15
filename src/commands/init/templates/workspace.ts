import type { Repo } from '../../generate/args'
import type { Replacements } from '../../generate/replace'
import type { Template } from '../../generate/templates'
import { getPackageReplacements } from '../../generate/templates/package'

export const workspaceTemplate: Template = {
  path: '.',
  owner: 'GaborTorma',
  repo: 'mwm-workspace-template',
  branch: 'main',
  getReplacements(repo: Repo): Replacements {
    return [
      ...getPackageReplacements(repo),
    ]
  },
}

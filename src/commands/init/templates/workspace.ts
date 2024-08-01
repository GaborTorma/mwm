import type { Repo } from '../../generate/args'
import type { Replacements } from '../../generate/replace'
import { getPackageReplacements } from '../../generate/templates/package'
import type { Template } from '../../generate/templates'

export const workspaceTemplate: Template = {
  path: '.',
  templateOwner: 'GaborTorma',
  templateRepo: 'mwm-workspace-template',
  getReplacements(repo: Repo): Replacements {
    return [
      ...getPackageReplacements(repo),
    ]
  },
}

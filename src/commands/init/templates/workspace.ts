import type { Replacements } from '../../generate/replace'
import type { Template } from '../../generate/templates'
import { packageReplacement } from '../../generate/replacements/package'

export const workspaceTemplate: Template = {
  path: '.',
  owner: 'GaborTorma',
  repo: 'mwm-workspace-template',
  branch: 'main',
  getReplacements(): Replacements {
    return [
      packageReplacement,
    ]
  },
}

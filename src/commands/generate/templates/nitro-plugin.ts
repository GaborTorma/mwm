import type { Template } from '.'
import type { Repo } from '../args'
import type { Replacements } from '../replace'
import { packageReplacement } from '../replacements/package'
import { getReadmeReplacement } from '../replacements/readme'

export const nitroPluginTemplate: Template = {
  path: 'releases',
  owner: 'GaborTorma',
  repo: 'mwm-nitro-plugin-template',
  branch: 'main',
  getReplacements(repo: Repo): Replacements {
    return [
      packageReplacement,
      getReadmeReplacement(this, repo),
    ]
  },
}

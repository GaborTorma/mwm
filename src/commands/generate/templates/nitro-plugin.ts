import { getPackageReplacements } from './package'
import type { Template } from '.'
import type { Repo } from '../args'
import type { Replacements } from '../replace'

export const nitroPluginTemplate: Template = {
  path: 'releases',
  owner: 'GaborTorma',
  repo: 'mwm-nitro-plugin-template',
  branch: 'main',
  getReplacements(repo: Repo): Replacements {
    return [
      ...getPackageReplacements(repo),
    ]
  },
}

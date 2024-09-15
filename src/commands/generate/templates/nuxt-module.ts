import { getPackageReplacements } from './package'
import type { Template } from '.'
import type { Repo } from '../args'
import type { Replacements } from '../replace'

export const nuxtModuleTemplate: Template = {
  path: 'modules',
  owner: 'GaborTorma',
  repo: 'mwm-nuxt-module-template',
  branch: 'main',
  getReplacements(repo: Repo): Replacements {
    return [
      ...getPackageReplacements(repo),
    ]
  },
}

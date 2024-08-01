import type { Repo } from '../args'
import type { Replacements } from '../replace'
import { getPackageReplacements } from './package'
import type { Template } from '.'

export const layerTemplate: Template = {
  path: 'layers',
  owner: 'GaborTorma',
  repo: 'mwm-nuxt-layer-template',
  branch: 'main',
  getReplacements(repo: Repo): Replacements {
    return [
      ...getPackageReplacements(repo),
    ]
  },
}

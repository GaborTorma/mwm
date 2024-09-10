import { getPackageReplacements } from './package'
import type { Template } from '.'
import type { Repo } from '../args'
import type { Replacements } from '../replace'

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

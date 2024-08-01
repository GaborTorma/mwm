import type { Repo } from '../args'
import type { Replacements } from '../replace'
import { getPackageReplacements } from './package'
import type { Template } from '.'

export const layerTemplate: Template = {
  path: 'layers',
  templateOwner: 'GaborTorma',
  templateRepo: 'mwm-nuxt-layer-template',
  getReplacements(repo: Repo): Replacements {
    return [
      ...getPackageReplacements(repo),
    ]
  },
}

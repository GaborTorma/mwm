import type { Template } from '.'
import type { Repo } from '../args'
import type { Replacements } from '../replace'
import { packageReplacement } from '../replacements/package'
import { getReadmeReplacement } from '../replacements/readme'

export const nuxtLayerTemplate: Template = {
  path: 'layers',
  owner: 'GaborTorma',
  repo: 'mwm-nuxt-layer-template',
  branch: 'main',
  getReplacements(repo: Repo): Replacements {
    return [
      packageReplacement,
      getReadmeReplacement(this, repo),
    ]
  },
}

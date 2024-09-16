import type { Template } from '.'
import type { Repo } from '../args'
import type { Replacements } from '../replace'
import { camelCase } from 'change-case'
import { packageReplacement } from '../replacements/package'
import { getReadmeReplacement } from '../replacements/readme'

export const nuxtModuleTemplate: Template = {
  path: 'modules',
  owner: 'GaborTorma',
  repo: 'mwm-nuxt-module-template',
  branch: 'main',
  getReplacements(repo: Repo): Replacements {
    return [
      packageReplacement,
      getReadmeReplacement(this, repo),
      { // configKey
        type: 'replace',
        files: [
          'playground/nuxt.config.ts',
          'src/module.ts',
        ],
        from: new RegExp(camelCase(this.repo), 'g'),
        to: camelCase(repo.name),
      },
      { // module name
        type: 'replace',
        files: [
          'src/module.ts',
          'src/runtime/plugin.ts',
        ],
        from: new RegExp(this.repo, 'g'),
        to: repo.name,
      },
    ]
  },
}

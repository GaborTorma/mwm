import { defineCommand } from 'citty'
import { getSubmodule } from './args'
import { generateRepo } from './generate'
import { selectTemplate } from './templates'

export const main = defineCommand({
  meta: {
    name: 'generate',
    description: 'Generate new submodule from template',
  },

  args: {
    template: {
      type: 'string',
      description: 'Select template (layer, package, release)',
    },
    owner: {
      alias: 'organization',
      type: 'string',
      description: 'Owner (organization) of the new submodule',
    },
    name: {
      type: 'string',
      description: 'Name of the new submodule',
    },
    description: {
      alias: 'desc',
      type: 'string',
      description: 'Description of the new submodule',
    },
    dir: {
      type: 'string',
      description: 'Directory to clone the new submodule',
    },
    private: {
      type: 'boolean',
      default: false,
      description: 'Create a private repository',
    },
  },

  async run({ args }) {
    const template = await selectTemplate(args.template)
    const submodule = await getSubmodule(args, template)

    await generateRepo(template, submodule)
  },
})

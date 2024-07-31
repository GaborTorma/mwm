import { defineCommand } from 'citty'
import { selectTemplate } from '../generate/templates'
import { generateRepo } from '../generate/generate'
import { getSubmodule } from '../generate/args'
import type { Args } from '../generate/args'

export const main = defineCommand({
  meta: {
    name: 'init',
    description: 'Initialize new MWM workspace',
  },
  args: {
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
    private: {
      type: 'boolean',
      default: true,
      description: 'Create a non-private repository',
    },
    dir: {
      type: 'string',
      default: '.',
      description: 'Directory to clone the new submodule',
    },
  },

  async run({ args }) {
    const template = await selectTemplate('workspace')
    const submodule = await getSubmodule(args as Args, template)

    await generateRepo(template, submodule)
  },
})

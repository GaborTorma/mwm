import { defineCommand } from 'citty'
import { getRepo } from './args'
import { generate } from './generate'
import { selectTemplate } from './templates'

export const main = defineCommand({
  meta: {
    name: 'generate',
    description: 'Generate new repo from template',
  },

  args: {
    template: {
      type: 'string',
      description: 'Select template (layer, package, release)',
    },
    owner: {
      alias: 'organization',
      type: 'string',
      description: 'Owner (organization) of the new repo',
    },
    name: {
      type: 'string',
      description: 'Name of the new repo',
    },
    description: {
      alias: 'desc',
      type: 'string',
      description: 'Description of the new repo',
    },
    dir: {
      type: 'string',
      description: 'Directory to clone the new repo',
    },
    private: {
      type: 'boolean',
      default: false,
      description: 'Create a private repository',
    },
    clone: {
      type: 'boolean',
      description: 'Clone the repo instead of submodule',
    },
    addRemoteTemplate: {
      alias: 'add-remote-template',
      type: 'boolean',
      description: 'Add remote template repository',
    },
  },

  async run({ args }) {
    const template = await selectTemplate(args.template)
    const repo = await getRepo(args, template)

    await generate(args, template, repo)
  },
})

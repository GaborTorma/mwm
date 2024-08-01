import { defineCommand } from 'citty'
import { getRepo } from '../generate/args'
import type { Args } from '../generate/args'
import { initRepo } from './init'
import { workspaceTemplate } from './templates/workspace'

export const main = defineCommand({
  meta: {
    name: 'init',
    description: 'Initialize new MWM workspace',
  },
  args: {
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
      default: true,
      description: 'Create a non-private repository',
    },
  },

  async run({ args }) {
    const template = workspaceTemplate
    const repo = await getRepo(args as Args, template)

    await initRepo(template, repo)
  },
})

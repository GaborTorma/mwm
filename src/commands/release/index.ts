import { defineCommand } from 'citty'
import { releaseWorkspaces } from './release'
import { selectWorkspaces } from './args'

export const main = defineCommand({
  meta: {
    name: 'release',
    description: 'Release selected workspaces',
  },

  args: {
    filter: {
      type: 'string',
      description: 'Select workspace',
    },
    releaseDependencies: {
      alias: ['release-dependencies', 'rd'],
      type: 'boolean',
      description: 'Release all dependencies of selected workspaces',
    },
  },

  async run({ args: { filter, releaseDependencies } }) {
    const selectedWorkspaces = await selectWorkspaces(filter)
    await releaseWorkspaces(selectedWorkspaces, releaseDependencies)
  },
})

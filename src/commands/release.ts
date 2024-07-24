import { runMain as _runMain, defineCommand } from 'citty'
import { selectWorkspaces } from '../workspaces'
import { releaseWorkspaces } from '../releases'

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

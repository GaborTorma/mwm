import { runMain as _runMain, defineCommand } from 'citty'
import { description, name, version } from '../package.json'
import { selectWorkspaces } from './workspaces'
import { releaseWorkspaces } from './releases'

const main = defineCommand({
  meta: {
    name: name.split('/').pop(),
    version,
    description,
  },

  args: {
    'filter': {
      type: 'string',
      description: 'Select workspace',
    },
    'release-dependencies': {
      type: 'boolean',
      description: 'Release all dependencies of selected workspaces',
    },
  },

  async run({ args: { filter, 'release-dependencies': releaseDependencies } }) {
    const selectedWorkspaces = await selectWorkspaces(filter)
    await releaseWorkspaces(selectedWorkspaces, releaseDependencies)
  },
})

export const runMain = async () => _runMain(main)

import { defineCommand } from 'citty'
import { addSubmodule } from './add'
import { getDir, getUrl } from './args'

export const main = defineCommand({
  meta: {
    name: 'generate',
    description: 'Generate new submodule from template',
  },

  args: {
    url: {
      alias: 'repo',
      type: 'string',
      description: 'Url of the repo of the new submodule',
    },
    dir: {
      type: 'string',
      description: 'Directory to clone the new submodule',
    },
  },

  async run({ args }) {
    const url = await getUrl(args.url)
    const dir = await getDir(args.dir)
    await addSubmodule(url, dir)
  },
})

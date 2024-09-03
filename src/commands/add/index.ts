import { defineCommand } from 'citty'
import { getDir, getUrl } from './args'
import { addSubmodule } from './add'

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

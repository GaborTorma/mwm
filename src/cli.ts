import { runMain as _runMain, defineCommand } from 'citty'
import { description, name, version } from '../package.json'
import { greetings } from './greetings'

const main = defineCommand({
  meta: {
    name: name.split('/').pop(),
    version,
    description,
  },

  args: {
    name: {
      type: 'positional',
      description: 'Your name',
      required: true,
    },
    friendly: {
      type: 'boolean',
      description: 'Use friendly greeting',
    },
  },

  run({ args }) {
    console.log(greetings(args.name, args.friendly))
  },
})

export const runMain = async () => _runMain(main)

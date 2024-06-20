import { runMain as _runMain, defineCommand } from 'citty'
import pkg from '../package.json'
import { greetings } from './greetings'

const main = defineCommand({
  meta: {
    name: 'citty-cli-starter',
    version: pkg.version,
    description: '_description_',
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

export const runMain = () => _runMain(main)

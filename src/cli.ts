import { runMain as _runMain, defineCommand } from 'citty'
import pkg from '../package.json'
import { greetings } from './greetings'

const main = defineCommand({
  meta: {
    name: 'mwm',
    version: pkg.version,
    description: 'Multi-repo Workspace Manager',
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

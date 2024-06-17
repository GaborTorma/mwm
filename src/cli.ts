import { runMain as _runMain, defineCommand } from 'citty'
import { greetings } from './greetings'

const main = defineCommand({
  meta: {
    name: 'nrwm',
    version: '1.0.0',
    description: 'My Awesome CLI App starter',
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

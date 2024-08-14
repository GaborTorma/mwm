import { runMain as _runMain, defineCommand } from 'citty'
import { description, name, version } from '../package.json'
import { checkPnpm } from './utils'

const main = defineCommand({
  meta: {
    name: name.split('/').pop(),
    version,
    description,
  },
  setup() { },
  cleanup() { },
  subCommands: {
    init: async () => import('./commands/init').then(r => r.main),
    generate: async () => import('./commands/generate').then(r => r.main),
    release: async () => import('./commands/release').then(r => r.main),
  },
})

export async function runMain() {
  await checkPnpm()
  await _runMain(main)
}

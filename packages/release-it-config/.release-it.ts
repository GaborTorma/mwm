// eslint-disable-next-line antfu/no-import-dist
import { defineReleaseItConfig } from './dist/index.mjs'
import { name } from './package.json'

export default defineReleaseItConfig('release', name)

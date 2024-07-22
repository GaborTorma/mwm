// eslint-disable-next-line antfu/no-import-dist
import { defineReleaseItConfig } from './dist/index.cjs'
import { name } from './package.json'

export default defineReleaseItConfig('release', name.split('/').pop())

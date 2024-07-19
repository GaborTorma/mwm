// eslint-disable-next-line antfu/no-import-dist
import defineReleaseItConfig from './dist/release-it-config/package.cjs'
import { name } from './package.json'

export default defineReleaseItConfig(name.split('/').pop())

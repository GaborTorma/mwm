import { defineReleaseItConfig } from './src/release-it-config/package'
import { name } from './package.json'

export default defineReleaseItConfig(name.split('/').pop())

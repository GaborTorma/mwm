import { defineReleaseItConfig } from 'mwm-release-it-config'
import { name } from './package.json'

export default defineReleaseItConfig('release', name.split('/').pop())

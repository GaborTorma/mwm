# mwm-release-it-config

## Install

```bash
pnpm add mvm-release-it-config
```

## Use different configs

```ts
// .release-it.ts
import { defineReleaseItConfig } from 'mvm-release-it-config'
import { name } from './package.json'

export default defineReleaseItConfig(
  'workspace' | 'package' | 'release' | 'nuxt-layer' | 'nuxt-module' | 'nitro-plugin',
  name.split('/').pop()
)
```

### Requirements

Use [`pnpm`](https://pnpm.io) as package manager

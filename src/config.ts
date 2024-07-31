import { loadConfig as _loadConfig, createDefineConfig } from 'c12'

export interface Owner {
  description?: string
  token?: string
}

export interface OwnerWithId extends Owner {
  id: string
}

export type Owners = Record<string, Owner>

interface MWMConfig {
  owners: Owners
}

export async function loadConfig() {
  return _loadConfig<MWMConfig>({
    name: 'mwm',
    configFile: 'mwm.config',
    rcFile: '.mwmrc',
    dotenv: true,
    globalRc: true,
  })
}

export const defineMWMConfig = createDefineConfig<MWMConfig>()

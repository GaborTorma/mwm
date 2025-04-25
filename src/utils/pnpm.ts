import type { ExecSyncOptions } from 'node:child_process'
import { execSync } from 'node:child_process'
import process from 'node:process'
import { consola } from 'consola'

export function checkPnpm() {
  try {
    const version = execSync('pnpm --version', { encoding: 'utf-8' })
    if (!/^9|10/.test(version))
      consola.error('pnpm version is not 9. Please install pnpm 9. See https://pnpm.io/installation')
  }
  catch (error) {
    consola.error('pnpm is not installed. Please install pnpm first. See https://pnpm.io/installation', error)
    process.exit(1)
  }
}

export function pnpmExec(args: string[], options?: ExecSyncOptions): string {
  return execSync(`pnpm ${args.join(' ')}`, {
    stdio: 'inherit',
    ...options,
    encoding: 'utf-8',
  })
}

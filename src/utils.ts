import process from 'node:process'
import pnpm from '@pnpm/exec'
import consola from 'consola'

export function checkCancel(value: unknown) {
  if (String(value) === Symbol.for('clack:cancel').toString()) {
    process.exit(1)
  }
}

export async function checkPnpm() {
  try {
    console.log('Checking pnpm version...')
    await pnpm(['--version'])
  }
  catch {
    consola.error('pnpm is not installed. Please install pnpm first. See https://pnpm.io/installation')
    process.exit(1)
  }
}

import process from 'node:process'
import consola from 'consola'

export async function getArg(arg: string, prompt: string): Promise<string> {
  const result = arg
    || await consola.prompt(prompt, {
      type: 'text',
    })
  checkCancel(result)
  return result
}

export function checkCancel(value: unknown) {
  if (String(value) === Symbol.for('clack:cancel').toString()) {
    process.exit(1)
  }
}

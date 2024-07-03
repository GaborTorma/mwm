import type Buffer from 'node:buffer'

export function stdoutToArray(stdout: Buffer): string[] {
  return stdout.toString()?.split(/\r?\n|\r/) || []
}

import type { GitProcessOutput } from 'workspace-tools'

export function processGitOutput(output: GitProcessOutput) {
  if (!output.success)
    return []

  return output.stdout
    .split(/\n/)
    .map(line => line.trim())
    .filter(line => !!line && !line.includes('node_modules'))
}

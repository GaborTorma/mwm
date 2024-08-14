import process from 'node:process'

export function checkCancel(value: unknown) {
  if (String(value) === Symbol.for('clack:cancel').toString()) {
    process.exit(1)
  }
}

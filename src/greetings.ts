export function greetings(name: string, friendly: boolean): string {
  return `${friendly ? 'Hi' : 'Greetings'} ${name}!`
}

import type { main } from '.'

export type Args = Parameters<Required<typeof main>['run']>[0]['args']

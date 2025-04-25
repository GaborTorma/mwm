import type { main } from './index'
import { consola } from 'consola'
import { getWorkspaces } from 'workspace-tools'
import { checkCancel } from '../../utils/args'

export type Args = Parameters<Required<typeof main>['run']>[0]['args']

export function getValidWorkspaces(): string[] {
  const workspaces = getWorkspaces('.')

  if (workspaces.length === 0)
    consola.error('There are no workspaces in this repository')

  return workspaces.map(w => w.name)
}

export type Filter = string | string[] | undefined

function getCheckedWorkspaces(workspaces: string[], validWorkspaces: string[]): Set<string> {
  const workspaceSet = new Set<string>()
  for (const workspace of workspaces) {
    if (validWorkspaces.includes(workspace))
      workspaceSet.add(workspace)
    else
      consola.warn(`${workspace} workspace not found. Skipping...`)
  }
  return workspaceSet
}

export async function getSelectedWorkspaces(filter: Filter): Promise<Set<string>> {
  const validWorkspaces = getValidWorkspaces()

  if (typeof filter === 'string')
    return getCheckedWorkspaces([filter], validWorkspaces)

  if (Array.isArray(filter))
    return getCheckedWorkspaces(filter, validWorkspaces)

  const workspaces = await consola.prompt('Select workspaces', {
    type: 'multiselect',
    options: validWorkspaces,
  })
  checkCancel(workspaces)
  return new Set<string>(workspaces)
}

export async function selectWorkspaces(filter: Filter): Promise<Set<string>> {
  const selectedWorkspaces = await getSelectedWorkspaces(filter)

  if (selectedWorkspaces.size === 0) {
    consola.error('No workspace selected')
  }
  else {
    consola.info('Selected workspaces:', ...selectedWorkspaces)
  }

  return selectedWorkspaces
}

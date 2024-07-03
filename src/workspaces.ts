import { getWorkspaces } from 'workspace-tools'
import consola from 'consola'

export function getValidWorkspaces(): string[] {
  const workspaces = getWorkspaces('.')

  if (workspaces.length === 0)
    consola.error('There are no workspaces in this repository')

  return workspaces.map(w => w.name)
}

export type Filter = string | string[] | undefined

function getCheckedWorkspaces(workspaces: string[], validWorkspaces: string[]): string[] {
  return workspaces.filter(workspace =>
    validWorkspaces.includes(workspace)
      ? true
      : consola.warn(`${workspace} workspace not found. Skipping...`),
  )
}

export async function getSelectedWorkspaces(filter: Filter): Promise<string[]> {
  const validWorkspaces = getValidWorkspaces()

  if (typeof filter === 'string')
    return getCheckedWorkspaces([filter], validWorkspaces)

  if (Array.isArray(filter))
    return getCheckedWorkspaces(filter, validWorkspaces)

  return consola.prompt('Select workspaces', {
    type: 'multiselect',
    options: validWorkspaces,
  })
}

export async function selectWorkspaces(filter: Filter): Promise<string[]> {
  const selectedWorkspaces = await getSelectedWorkspaces(filter)

  if (selectedWorkspaces.length === 0) {
    consola.error('No workspace selected')
  }
  else {
    consola.info('Selected workspaces:', ...selectedWorkspaces)
  }

  return selectedWorkspaces
}

/*
export function filterIsEqualWithWorkspaces(filter: Filter, workspaces: string[]): boolean {
  if (!Array.isArray(filter))
    return false

  if (filter.length !== workspaces.length)
    return false

  return workspaces.every(workspace => filter.includes(workspace))
}
*/

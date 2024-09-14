import path from 'node:path'
import consola from 'consola'
import { loadConfig } from '../../config'
import { checkCancel, getArg } from '../../utils/args'
import type { Owners, OwnerWithId } from '../../config'
import type { main } from './index'
import type { Template } from './templates'

export type Args = Parameters<Required<typeof main>['run']>[0]['args']

export async function selectOwner(owner: string, owners?: Owners): Promise<OwnerWithId> {
  if (!owners) {
    throw new Error('No owners found! Please add owners to the config file')
  }

  const ownersWithToken: Owners = {}
  for (const key of Object.keys(owners)) {
    if (owners[key].token)
      ownersWithToken[key] = owners[key]
  }

  const options = Object.keys(ownersWithToken)

  if (options.length === 0) {
    throw new Error('No owners with token found! Please add owners with token to the config file')
  }

  if (!ownersWithToken[owner]) {
    owner = await consola.prompt('Select Owner', {
      type: 'select',
      options,
    })
    checkCancel(owner)
  }
  return {
    id: owner,
    ...ownersWithToken[owner],
  }
}

export async function getName(name: string) {
  return getArg(name, 'Enter the name of the new repo')
}

export async function getDescription(description: string) {
  return getArg(description, 'Enter the description of the new repo')
}

export async function getPath(dir: string, name: string, template: Template): Promise<string> {
  if (dir) {
    return dir
  }
  const repoPath = path.join(template.path, name)
  const result = consola.prompt('Set the path of the new repo', {
    type: 'text',
    placeholder: repoPath,
    default: repoPath,
  })
  checkCancel(result)
  return result
}

export interface Repo {
  owner: OwnerWithId
  name: string
  description: string
  path: string
  private: boolean
}

export async function getRepo(args: Args, template: Template): Promise<Repo> {
  const { config } = await loadConfig()
  const name = await getName(args.name)
  return {
    owner: await selectOwner(args.owner, config.owners),
    name,
    description: await getDescription(args.description),
    path: await getPath(args.dir, name, template),
    private: args.private,
  }
}

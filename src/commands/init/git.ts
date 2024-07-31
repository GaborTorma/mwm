import git from 'simple-git'
import type { Submodule } from '../generate/args'

function getRepoUrlFromSubmodule({
  owner: { id, token },
  name,
}: Submodule) {
  return `https://${id}:${token}@github.com/${id}/${name}.git`
}

export async function cloneRepo(submodule: Submodule) {
  const repoUrl = getRepoUrlFromSubmodule(submodule)
  return git().clone(repoUrl, submodule.path)
}

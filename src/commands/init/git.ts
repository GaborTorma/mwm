import git from 'simple-git'
import type { Repo } from '../generate/args'

function getRepoUrl({
  owner: { id, token },
  name,
}: Repo) {
  return `https://${id}:${token}@github.com/${id}/${name}.git`
}

export async function cloneRepo(repo: Repo) {
  const repoUrl = getRepoUrl(repo)
  return git().clone(repoUrl, repo.path)
}
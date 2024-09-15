import type { Repo } from './args'
import git from 'simple-git'
import { getRepoUrl } from '../init/git'

export async function addSubmodule(repo: Repo) {
  const repoUrl = getRepoUrl(repo)
  return git().submoduleAdd(repoUrl, repo.path)
}

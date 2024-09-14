import git from 'simple-git'
import { getRepoUrl } from '../init/git'
import type { Repo } from './args'

export async function addSubmodule(repo: Repo) {
  const repoUrl = getRepoUrl(repo)
  return git().submoduleAdd(repoUrl, repo.path)
}

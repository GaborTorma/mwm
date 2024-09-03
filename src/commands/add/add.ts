import git from 'simple-git'

export async function addSubmodule(url: string, dir: string) {
  return git().submoduleAdd(url, dir)
}

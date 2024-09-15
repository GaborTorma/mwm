import { pnpmExec } from '../../utils/pnpm'
import { sleep } from '../../utils/sleep'
import { cloneRepo } from '../init/git'
import { type Args, getAddRemoteTemplate, getClone, type Repo } from './args'
import { addSubmodule } from './git'
import { generateGitHubRepo } from './github'
import { fixFiles, replaceInFiles } from './replace'
import { addRemoteTemplate, commitInitChanges, pushChanges, type Template } from './templates'

export async function deployRepo(arg: boolean, repo: Repo) {
  return await getClone(arg) ? cloneRepo(repo) : addSubmodule(repo)
}

export async function generate(args: Args, template: Template, repo: Repo) {
  await generateGitHubRepo(template, repo)
  await sleep(2000)
  await deployRepo(args.clone, repo)
  if (await getAddRemoteTemplate(args.addRemoteTemplate)) {
    await addRemoteTemplate(template, repo)
  }
  const replacements = template.getReplacements(repo)
  fixFiles(replacements, repo.path)
  await replaceInFiles(replacements)
  pnpmExec(['install'], { cwd: repo.path })
  await commitInitChanges(repo)
  await pushChanges(repo)
}

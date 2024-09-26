import { pnpmExec } from '../../utils/pnpm'
import { sleep } from '../../utils/sleep'
import { cloneRepo } from '../init/git'
import { type Args, getAddRemoteTemplate, getClone, getFixReplacements, type Repo } from './args'
import { addSubmodule } from './git'
import { generateGitHubRepo } from './github'
import { fixReplacements } from './replace'
import { addRemoteTemplate, commitInitChanges, pushChanges, type Template } from './templates'

export async function deployRepo(arg: boolean, repo: Repo) {
  return await getClone(arg) ? cloneRepo(repo) : addSubmodule(repo)
}

export async function generate(args: Args, template: Template, repo: Repo) {
  await generateGitHubRepo(template, repo)
  await sleep(2000)
  await deployRepo(args.clone, repo)
  if (await getAddRemoteTemplate(args.addRemoteTemplate))
    await addRemoteTemplate(template, repo)

  if (await getFixReplacements(args.fixReplacements))
    await fixReplacements(template.getReplacements(repo), repo)
  pnpmExec(['install', '--fix-lockfile', '--force'], { cwd: repo.path })
  pnpmExec(['prepare'], { cwd: repo.path })
  pnpmExec(['lint:fix'], { cwd: repo.path })
  await commitInitChanges(repo)
  await pushChanges(repo)
}

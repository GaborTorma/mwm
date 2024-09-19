import type { Args } from './args'
import { pnpmExec } from '../../utils/pnpm'
import { sleep } from '../../utils/sleep'
import { getAddRemoteTemplate, getFixReplacements, type Repo } from '../generate/args'
import { generateGitHubRepo } from '../generate/github'
import { fixReplacements } from '../generate/replace'
import { addRemoteTemplate, commitInitChanges, pushChanges, type Template } from '../generate/templates'
import { cloneRepo } from './git'

export async function initRepo(args: Args, template: Template, repo: Repo) {
  await generateGitHubRepo(template, repo)
  await sleep(2000)
  await cloneRepo(repo)
  if (await getAddRemoteTemplate(args.addRemoteTemplate))
    await addRemoteTemplate(template, repo)
  if (await getFixReplacements(args.fixReplacements))
    await fixReplacements(template.getReplacements(repo), repo)
  pnpmExec(['install', '--fix-lockfile', '--force'], { cwd: repo.path })
  pnpmExec(['lint:fix'], { cwd: repo.path })
  await commitInitChanges(repo)
  await pushChanges(repo)
}

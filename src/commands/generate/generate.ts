import { sleep } from '../../utils/sleep'
import { cloneRepo } from '../init/git'
import { pnpmExec } from '../../utils/pnpm'
import type { Repo } from './args'
import { type Template, addRemoteTemplate, commitInitChanges, pushChanges } from './templates'
import { generateGitHubRepo } from './github'
import { fixFiles, replaceInFiles } from './replace'

export async function generateRepo(template: Template, repo: Repo) {
  await generateGitHubRepo(template, repo)
  await sleep(2000)
  await cloneRepo(repo)
  await addRemoteTemplate(template, repo)
  const replacements = template.getReplacements(repo)
  fixFiles(replacements, repo.path)
  await replaceInFiles(replacements)
  pnpmExec(['install'], { cwd: repo.path })
  await commitInitChanges(repo)
  await pushChanges(repo)
}

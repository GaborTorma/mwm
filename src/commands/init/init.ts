import type { Repo } from '../generate/args'
import { generateGitHubRepo } from '../generate/github'
import { fixFiles, replaceInFiles } from '../generate/replace'
import { type Template, addRemoteTemplate, commitInitChanges, pushChanges } from '../generate/templates'
import { pnpmExec } from '../../utils/pnpm'
import { sleep } from '../../utils/sleep'
import { cloneRepo } from './git'

export async function initRepo(template: Template, repo: Repo) {
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

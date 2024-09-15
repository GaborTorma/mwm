import { pnpmExec } from '../../utils/pnpm'
import { sleep } from '../../utils/sleep'
import { addSubmodule } from './git'
import { generateGitHubRepo } from './github'
import { fixFiles, replaceInFiles } from './replace'
import { addRemoteTemplate, commitInitChanges, pushChanges, type Template } from './templates'
import type { Repo } from './args'

export async function generateSubmodule(template: Template, repo: Repo) {
  await generateGitHubRepo(template, repo)
  await sleep(2000)
  await addSubmodule(repo)
  await addRemoteTemplate(template, repo)
  const replacements = template.getReplacements(repo)
  fixFiles(replacements, repo.path)
  await replaceInFiles(replacements)
  pnpmExec(['install'], { cwd: repo.path })
  await commitInitChanges(repo)
  await pushChanges(repo)
}

import pnpm from '@pnpm/exec'
import type { Repo } from '../generate/args'
import { generateGitHubRepo } from '../generate/github'
import { fixFiles, replaceInFiles } from '../generate/replace'
import { type Template, addRemoteTemplate, commitInitChanges, pushChanges } from '../generate/templates'
import { cloneRepo } from './git'

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function initRepo(template: Template, repo: Repo) {
  await generateGitHubRepo(template, repo)
  await sleep(2000)
  await cloneRepo(repo)
  await addRemoteTemplate(template, repo)
  const replacements = template.getReplacements(repo)
  fixFiles(replacements, repo.path)
  await replaceInFiles(replacements)
  await pnpm(['install'], { cwd: repo.path })
  await commitInitChanges(repo)
  await pushChanges(repo)
}

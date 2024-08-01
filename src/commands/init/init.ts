import type { Repo } from '../generate/args'
import { generateGitHubRepo } from '../generate/github'
import { fixFiles, replaceInFiles } from '../generate/replace'
import type { Template } from '../generate/templates'
import { cloneRepo } from './git'

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function initRepo(template: Template, repo: Repo) {
  await generateGitHubRepo(template, repo)
  await sleep(2000)
  await cloneRepo(repo)
  const replacements = template.getReplacements(repo)
  fixFiles(replacements, repo.path)
  await replaceInFiles(replacements)
}

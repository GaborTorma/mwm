import type { Repo } from '../generate/args'
import { generateGitHubRepo } from '../generate/github'
import type { Template } from '../generate/templates'
import { cloneRepo } from './git'

export async function initRepo(template: Template, repo: Repo) {
  await generateGitHubRepo(template, repo)
  await cloneRepo(repo)
}

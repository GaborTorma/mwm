import type { Submodule } from '../generate/args'
import { generateGitHubRepo } from '../generate/github'
import type { Template } from '../generate/templates'
import { cloneRepo } from './git'

export async function initRepo(template: Template, submodule: Submodule) {
  await generateGitHubRepo(template, submodule)
  await cloneRepo(submodule)
}

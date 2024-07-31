import type { Repo } from './args'
import type { Template } from './templates'
import { generateGitHubRepo } from './github'

export async function generateRepo(template: Template, repo: Repo) {
  await generateGitHubRepo(template, repo)
}

export { generateGitHubRepo }

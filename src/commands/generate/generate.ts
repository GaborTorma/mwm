import type { Submodule } from './args'
import type { Template } from './templates'
import { generateGitHubRepo } from './github'

export async function generateRepo(template: Template, submodule: Submodule) {
  await generateGitHubRepo(template, submodule)
}

export { generateGitHubRepo }

import { Octokit } from '@octokit/rest'
import type { Submodule } from './args'
import type { Template } from './templates'

export async function generateGitHubRepo(template: Template, submodule: Submodule) {
  const octokit = new Octokit({
    auth: submodule.owner.token,
  })
  await octokit.request(`POST /repos/${template.templateOwner}/${template.templateRepo}/generate`, {
    owner: submodule.owner.id,
    name: submodule.name,
    description: submodule.description,
    private: submodule.private,
    include_all_branches: false,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
}

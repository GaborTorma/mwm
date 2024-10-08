import type { Repo } from './args'
import type { Template } from './templates'
import { Octokit } from '@octokit/rest'

export async function generateGitHubRepo(template: Template, repo: Repo) {
  const octokit = new Octokit({
    auth: repo.owner.token,
  })
  await octokit.request(`POST /repos/${template.owner}/${template.repo}/generate`, {
    owner: repo.owner.id,
    name: repo.name,
    description: repo.description,
    private: repo.private,
    include_all_branches: false,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
}

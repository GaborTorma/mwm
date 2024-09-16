import type { PackageJson } from 'pkg-types'
import type { Repo } from '../args'
import type { Replacement } from '../replace'

export const packageReplacement: Replacement = {
  type: 'pkg',
  replace: (packageJson: PackageJson, repo: Repo) => {
    const fullRepo = `${repo.owner.id}/${repo.name}`
    packageJson.name = `@${repo.owner.id.toLowerCase()}/${repo.name}`
    packageJson.author = repo.owner.name || repo.owner.id
    packageJson.description = repo.description
    packageJson.version = '0.0.1'
    packageJson.repository = {
      type: 'github',
      url: `git+ssh://git@github.com/${fullRepo}.git`,
    }
    if (repo.keywords)
      packageJson.keywords = repo.keywords
    if (packageJson.homepage)
      packageJson.homepage = `https://github.com/${fullRepo}`
    if (packageJson.bugs)
      packageJson.bugs = `https://github.com/${fullRepo}/issues`
    return packageJson
  },
}

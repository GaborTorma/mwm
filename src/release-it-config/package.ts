import defu from 'defu'
import type { Config } from 'release-it'

export function defineReleaseItConfig(name: string, config: Config): Config {
  const releaseName = name.split('/').pop()
  // eslint-disable-next-line no-template-curly-in-string
  const versionTemplate = '${version}'

  const defConfig = {
    git: {
      commitMessage: `Release: ${releaseName} ${versionTemplate}`,
      tagAnnotation: `Release: ${releaseName} ${versionTemplate}`,
      tagName: `${releaseName}-v${versionTemplate}`,
      requireCommits: true,
      requireCommitsFail: false,
    },
    github: {
      release: true,
    },
    npm: {
      publish: true,
    },
  } satisfies Config

  return defu(config, defConfig)
}

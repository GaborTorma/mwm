import defu from 'defu'
import type { Config } from 'release-it'

export default function defineReleaseItConfig(name?: string, config?: Config): Config {
  // eslint-disable-next-line no-template-curly-in-string
  const versionTemplate = '${version}'

  const commitMessage = name
    ? `Release: ${name} ${versionTemplate}`
    : `Release: ${versionTemplate}`

  const tagName = name
    ? `${name}-v-${versionTemplate}`
    : `v-${versionTemplate}`

  const defConfig = {
    git: {
      commitMessage,
      tagAnnotation: commitMessage,
      tagName,
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

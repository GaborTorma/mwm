import defu from 'defu'
import type { Config } from 'release-it'

function defConfigForPackage(commitMessage: string, tagName: string, tagAnnotation: string = commitMessage): Config {
  return {
    git: {
      commitMessage,
      tagAnnotation,
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
}

function defConfigForRelease(commitMessage: string, tagName: string, tagAnnotation: string = commitMessage): Config {
  return {
    git: {
      commitMessage,
      tagAnnotation,
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
}

  type Preset = 'package' | 'release'

export function defineReleaseItConfig(preset: Preset, name?: string, config?: Config): Config {
  // eslint-disable-next-line no-template-curly-in-string
  const versionTemplate = '${version}'

  const commitMessage = name
    ? `Release: ${name} ${versionTemplate}`
    : `Release: ${versionTemplate}`

  const tagName = name
    ? `${name}-v-${versionTemplate}`
    : `v-${versionTemplate}`

  switch (preset) {
    case 'package':
      return defu(config, defConfigForPackage(commitMessage, tagName))
    case 'release':
      return defu(config, defConfigForRelease(commitMessage, tagName))
  }
}

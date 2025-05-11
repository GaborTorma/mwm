import type { Config } from 'release-it'
import defu from 'defu'

function defineConfigForWorkspace(commitMessage: string, tagName: string, tagAnnotation: string = commitMessage): Config {
  return {
    git: {
      requireCleanWorkingDir: true,
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
      publish: false,
    },
  } satisfies Config
}

function defineConfigForPackage(commitMessage: string, tagName: string, tagAnnotation: string = commitMessage): Config {
  return {
    plugins: {
      'release-it-pnpm': {
        inFile: 'CHANGELOG.md',
      },
    },
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

function defineConfigForRelease(commitMessage: string, tagName: string, tagAnnotation: string = commitMessage): Config {
  return {
    plugins: {
      'release-it-pnpm': {
        inFile: 'CHANGELOG.md',
      },
    },
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

function defineConfigForNuxt(commitMessage: string, tagName: string, tagAnnotation: string = commitMessage): Config {
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

function defineConfigForNuxtLayer(commitMessage: string, tagName: string, tagAnnotation: string = commitMessage): Config {
  return defineConfigForNuxt(commitMessage, tagName, tagAnnotation)
}

function defineConfigForNuxtModule(commitMessage: string, tagName: string, tagAnnotation: string = commitMessage): Config {
  return defineConfigForNuxt(commitMessage, tagName, tagAnnotation)
}

function defineConfigForNitroPlugin(commitMessage: string, tagName: string, tagAnnotation: string = commitMessage): Config {
  return defineConfigForNuxt(commitMessage, tagName, tagAnnotation)
}

type Preset = 'workspace' | 'package' | 'release' | 'nuxt-layer' | 'nuxt-module' | 'nitro-plugin'

export function defineReleaseItConfig(preset: Preset, name?: string, config?: Config): Config {
  // eslint-disable-next-line no-template-curly-in-string
  const versionTemplate = '${version}'

  const commitMessage = name
    ? `Release: ${name} ${versionTemplate}`
    : `Release: ${versionTemplate}`

  const tagName = name
    ? `${name}-v${versionTemplate}`
    : `v${versionTemplate}`

  switch (preset) {
    case 'workspace':
      return defu(config, defineConfigForWorkspace(commitMessage, tagName))
    case 'package':
      return defu(config, defineConfigForPackage(commitMessage, tagName))
    case 'release':
      return defu(config, defineConfigForRelease(commitMessage, tagName))
    case 'nuxt-layer':
      return defu(config, defineConfigForNuxtLayer(commitMessage, tagName))
    case 'nuxt-module':
      return defu(config, defineConfigForNuxtModule(commitMessage, tagName))
    case 'nitro-plugin':
      return defu(config, defineConfigForNitroPlugin(commitMessage, tagName))
  }
}

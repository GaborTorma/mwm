import type { SimpleGit } from 'simple-git'
import type { Repo } from '../args'
import type { Replacements } from '../replace'
import path from 'node:path'
import { consola } from 'consola'
import simpleGit from 'simple-git'
import { checkCancel } from '../../../utils/args'
import { nitroPluginTemplate } from './nitro-plugin'
import { nuxtLayerTemplate } from './nuxt-layer'
import { nuxtModuleTemplate } from './nuxt-module'

const templateTypes = ['nuxt-layer', 'nuxt-module', 'nitro-plugin']

export type TemplateType = typeof templateTypes[number]

export interface Template {
  path: string
  owner: string
  repo: string
  branch: string
  getReplacements(input: Repo): Replacements
}

export type Templates = Record<TemplateType, Template>

export const templates: Templates = {
  'nuxt-layer': nuxtLayerTemplate,
  'nuxt-module': nuxtModuleTemplate,
  'nitro-plugin': nitroPluginTemplate,
} as const

export async function selectTemplate(template: string): Promise<Template> {
  if (!templates[template]) {
    template = await consola.prompt('Select template', {
      type: 'select',
      options: templateTypes,
    })
    checkCancel(template)
  }
  return templates[template]
}

export async function getGit(repo: Repo): Promise<SimpleGit> {
  return simpleGit({
    baseDir: path.resolve(repo.path),
  })
}

export async function addRemoteTemplate(template: Template, repo: Repo) {
  const git = await getGit(repo)
  await git.addRemote('template', `git@github.com:${template.owner}/${template.repo}.git`)
  await git.fetch('template', 'main')
  await git.merge([`template/${template.branch}`, '--allow-unrelated-histories', '--message=Merge template'])
}

export async function commitInitChanges(repo: Repo) {
  const git = await getGit(repo)
  await git.add('.')
  await git.commit('Customize template')
}

export async function pushChanges(repo: Repo) {
  const git = await getGit(repo)
  await git.push('origin', 'main')
}

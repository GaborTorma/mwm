import consola from 'consola'
import type { Repo } from '../args'
import type { Replacements } from '../replace'
import { layerTemplate } from './layer'

const templateTypes = ['layer']

export type TemplateType = typeof templateTypes[number]

export interface Template {
  path: string
  templateOwner: string
  templateRepo: string
  getReplacements(input: Repo): Replacements
}

export type Templates = Record<TemplateType, Template>

export const templates: Templates = {
  layer: layerTemplate,
} as const

export async function selectTemplate(template: string): Promise<Template> {
  if (!templates[template]) {
    template = await consola.prompt('Select template', {
      type: 'select',
      options: templateTypes,
    })
  }
  return templates[template]
}

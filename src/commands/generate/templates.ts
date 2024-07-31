import consola from 'consola'

export interface Template {
  path: string
  templateOwner: string
  templateRepo: string
  replaces?: string[]
}

const templateTypesWithoutWorkspaces = ['layer']

const templateTypes = ['workspace', ...templateTypesWithoutWorkspaces] as const

export type TemplateType = typeof templateTypes[number]

export type Templates = Record<TemplateType, Template>

export const templates: Templates = {
  workspace: {
    path: '.',
    templateOwner: 'GaborTorma',
    templateRepo: 'mwm-workspace-template',
  },
  layer: {
    path: 'layers',
    templateOwner: 'GaborTorma',
    templateRepo: 'mwm-nuxt-layer-template',
  },
} as const

export async function selectTemplate(template: string): Promise<Template> {
  if (!templates[template]) {
    template = await consola.prompt('Select template', {
      type: 'select',
      options: templateTypesWithoutWorkspaces,
    })
  }
  return templates[template]
}

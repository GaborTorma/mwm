import consola from 'consola'

export interface Template {
  path: string
  templateOwner: string
  templateRepo: string
  replaces?: string[]
}

type Templates = Record<string, Template>

export const templates: Templates = {
  layer: {
    path: 'layers',
    templateOwner: 'GaborTorma',
    templateRepo: 'mwm-nuxt-layer-template',
    replaces: [],
  },
}

export async function selectTemplate(template: string): Promise<Template> {
  if (!templates[template]) {
    template = await consola.prompt('Select template', {
      type: 'select',
      options: Object.keys(templates),
    })
  }
  return templates[template]
}

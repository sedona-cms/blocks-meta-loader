export type BlockMeta = {
  name?: string
  title?: string
  description?: string
  icon?: string // default is 'extension'
  group: string // default is 'general'
  path?: string // path to component file, use for import
  props: {
    [key: string]: BlockProp
  }
}

export type BlockProp = {
  title?: string
  type?: 'string' | 'boolean' | 'number' | 'array' | 'object' | 'date' | string
  editor?: 'text' | 'textarea' | 'number' | 'checkbox' | 'date' | string
  required?: boolean
  default?: unknown
  options?: unknown
}

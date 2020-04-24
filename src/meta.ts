export type BlockMeta = {
  name?: string
  title?: string
  description?: string
  icon?: string // default is 'extension'
  group: string // default is 'general'
  props: {
    [key: string]: BlockProp
  }
}

export type BlockProp = {
  title?: string
  type?: 'string' | 'boolean' | 'number' | 'array' | 'object' | 'date' | string
  required?: boolean
  default?: any
  options?: any
}
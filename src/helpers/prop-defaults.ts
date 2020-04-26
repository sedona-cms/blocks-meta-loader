import { BlockProp } from '../meta'

export const typeDefaults: { [key: string]: BlockProp } = {
  String: {
    type: 'string',
    editor: 'text',
    required: false,
    default: '',
  },
  Boolean: {
    type: 'boolean',
    editor: 'checkbox',
    required: false,
    default: false,
  },
  Number: {
    type: 'number',
    editor: 'number',
    required: false,
    default: 0,
  },
  Array: {
    type: 'array',
    editor: 'textarea',
    required: false,
    default: [],
  },
  Object: {
    type: 'object',
    editor: 'textarea',
    required: false,
    default: {},
  },
  Date: {
    type: 'date',
    editor: 'date',
    required: false,
    default: Date.now(),
  },
}

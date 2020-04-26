import * as fs from 'fs'
import * as path from 'path'
import * as babel from '@babel/parser'
import traverse from '@babel/traverse'
import mergeWith from 'lodash/mergeWith'
import { Expression, ObjectMethod, ObjectProperty, PatternLike, SpreadElement } from '@babel/types'
import startCase from 'lodash/startCase'
import { BlockMeta, BlockProp } from '../meta'

export class JsFileParser {
  parseFile(blockPath: string): BlockMeta {
    const content = fs.readFileSync(blockPath).toString('utf-8')
    return {
      ...this.parseContent(content),
      path: path.parse(blockPath).name,
    }
  }

  parseContent(script: string): BlockMeta {
    const result: BlockMeta = {
      group: 'general',
      props: {},
    }
    let properties: ObjectProperty[] = []
    const ast = babel.parse(script, { sourceType: 'module' })
    traverse(ast, {
      ObjectProperty(scope) {
        const keyName = scope.node.key.name
        switch (keyName) {
          case 'name': {
            result.name = scope.node?.value['value'] || ''
            result.title = startCase(result.name)
            break
          }
          case 'props':
            properties = scope.node.value?.['properties'] || []
            break
        }
      },
    })

    if (properties.length > 0) {
      result.props = this.parseProps(properties)
    }

    return result
  }

  /**
   * Parse props section in component
   *
   * @param {ObjectProperty[]} properties
   * @return {{ [key: string]: BlockProp }} properties
   */
  private parseProps(properties: ObjectProperty[]): { [key: string]: BlockProp } {
    const result: { [key: string]: BlockProp } = {}
    for (const property of properties) {
      const propName = property.key?.name || 'unknown'
      result[propName] = {
        title: startCase(propName),
        ...this.parsePropValue(property.value),
      }
    }
    return result
  }

  /**
   * Parse single prop value in props section
   *
   * @param {Expression | PatternLike} propValue
   * @return {BlockProp}
   */
  private parsePropValue(propValue: Expression | PatternLike): BlockProp {
    let result: BlockProp = {}
    switch (propValue.type) {
      case 'ObjectExpression': {
        result = this.parsePropObject(propValue.properties)
        break
      }
      case 'Identifier':
        result = this.parsePropIdentifier(propValue.name)
        break
    }

    if (!Object.keys(result).includes('required')) {
      result.required = false
    }

    return result
  }

  private parsePropIdentifier(identifier: string): BlockProp {
    switch (identifier) {
      case 'String':
        return {
          type: 'string',
          editor: 'text',
          required: false,
          default: '',
        }
      case 'Boolean':
        return {
          type: 'boolean',
          editor: 'checkbox',
          required: false,
          default: false,
        }
      case 'Number':
        return {
          type: 'number',
          editor: 'number',
          required: false,
          default: 0,
        }
      case 'Array':
        return {
          type: 'array',
          editor: 'textarea',
          required: false,
          default: [],
        }
      case 'Object':
        return {
          type: 'object',
          editor: 'textarea',
          required: false,
          default: {},
        }
      case 'Date':
        return {
          type: 'date',
          editor: 'date',
          required: false,
          default: Date.now(),
        }
      default:
        return {
          type: 'string',
          editor: 'text',
          required: false,
          default: '',
        }
    }
  }

  /**
   * Parse single prop value in props section if the prop value is object
   *
   * @param {Array<ObjectMethod | ObjectProperty | SpreadElement>} properties
   * @return {BlockProp}
   */
  private parsePropObject(
    properties: Array<ObjectMethod | ObjectProperty | SpreadElement>
  ): BlockProp {
    let result: BlockProp = {}
    let propType = 'String'
    for (const propertyItem of properties) {
      if (propertyItem.type !== 'ObjectProperty') {
        continue
      }
      switch (propertyItem.key?.name) {
        case 'type': {
          propType =
            propertyItem.value.type === 'Identifier' ? propertyItem.value.name.toString() : 'String'
          result.type = propType.toLowerCase()
          break
        }
        case 'default': {
          if (propertyItem.value.type === 'BooleanLiteral') {
            result.default = propertyItem.value.value
            break
          }
          result.default = propertyItem.value?.['value'] || ''
          break
        }
        case 'required':
          if (propertyItem.value.type !== 'BooleanLiteral') {
            result.required = false
            break
          }
          result.required = propertyItem.value.value
          break
        case 'validator':
          break
      }
    }

    const blockProp: BlockProp = {}
    const defaultProp = this.parsePropIdentifier(propType)
    for (const propKey of Object.keys(defaultProp)) {
      if (propKey === 'type') {
        blockProp.type = defaultProp.type
        continue
      }
      blockProp[propKey] = result?.[propKey] || defaultProp[propKey]
    }

    return blockProp
  }
}

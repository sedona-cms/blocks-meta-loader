import * as fs from 'fs'
import * as templateCompiler from 'vue-template-compiler'
import path from 'path'
import Ajv from 'ajv'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import { SFCDescriptor, parse } from '@vue/component-compiler-utils'
import { VueTemplateCompiler } from '@vue/component-compiler-utils/dist/types'
import { JsFileParser } from './js-file-parser'
import { BlockMeta } from '../meta'

import blockMetaSchema from '../schema/block-meta.schema.json'

export class VueFileParser {
  parse(blockPath: string): BlockMeta {
    const blockFile = this.readBlockFile(blockPath)
    const blockSection = blockFile.customBlocks.find(item => item.type === 'block')
    let blockMeta: BlockMeta | undefined
    if (blockSection !== undefined) {
      blockMeta = JSON.parse(blockSection.content) as BlockMeta
      if (typeof blockMeta !== 'object') {
        throw new TypeError(`Error parsing meta json in file ${blockPath}`)
      }
      this.validateMeta(blockMeta)
    }

    const parsed = new JsFileParser().parseContent(blockFile?.script?.content || '')

    if (parsed !== undefined && blockMeta === undefined) {
      const blockFileName = path.parse(blockPath).name

      const result: BlockMeta = {
        ...parsed,
        path: blockFileName,
      }

      if (result.name === undefined) {
        result.name = upperFirst(camelCase(blockFileName))
      }

      return result
    }

    if (blockMeta !== undefined) {
      return {
        ...this.getNormalizedBlockMeta(parsed, blockMeta),
        path: path.parse(blockPath).name,
      }
    }

    throw new Error(`Error parsing block in path ${blockPath}`)
  }

  private readBlockFile(blockPath: string): SFCDescriptor {
    const content = fs.readFileSync(blockPath).toString('utf-8')
    return parse({
      source: content,
      compiler: templateCompiler as VueTemplateCompiler,
      needMap: false,
    })
  }

  private validateMeta(data: BlockMeta): void {
    const ajv = new Ajv()
    const validate = ajv.compile(blockMetaSchema)
    const valid = validate(data)
    if (!valid && Array.isArray(validate.errors)) {
      const message = ['Schema Config Validation Error']
      validate.errors.forEach(error => {
        message.push(`data: ${error.dataPath}`)
        message.push(`schema: ${error.schemaPath}`)
        message.push(`message: ${error.message}`)
      })
      throw new Error(message.join(`\n`))
    }
  }

  private getNormalizedBlockMeta(parsedMeta: BlockMeta, jsonMeta: BlockMeta): BlockMeta {
    const result: BlockMeta = {
      name: parsedMeta.name,
      title: jsonMeta?.name || parsedMeta.title,
      group: jsonMeta?.group || 'general',
      icon: jsonMeta?.icon || 'extension',
      props: {},
    }
    const propKeys = Object.keys(parsedMeta.props)
    if (propKeys.length === 0) {
      return result
    }
    for (const propKey of propKeys) {
      result.props[propKey] = {
        title: jsonMeta?.props?.[propKey]?.title || parsedMeta.props[propKey].title,
        type: jsonMeta?.props?.[propKey]?.type || parsedMeta.props[propKey].type,
        editor: jsonMeta?.props?.[propKey]?.editor || parsedMeta.props[propKey].editor,
        required: parsedMeta.props[propKey].required,
        default: jsonMeta?.props?.[propKey]?.default || parsedMeta.props[propKey].default,
        options: jsonMeta?.props?.[propKey]?.options || {},
      }
    }

    return result
  }
}

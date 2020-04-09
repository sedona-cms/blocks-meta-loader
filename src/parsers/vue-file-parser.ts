import * as fs from 'fs'
import * as templateCompiler from 'vue-template-compiler'
import { SFCDescriptor, parse } from '@vue/component-compiler-utils'
import { VueTemplateCompiler } from '@vue/component-compiler-utils/dist/types'
import { JsFileParser } from './js-file-parser'
import { BlockMeta } from '../meta'

export class VueFileParser {
  parse(blockPath: string): BlockMeta {
    const blockFile = this.readBlockFile(blockPath)
    const blockSection = blockFile.customBlocks.find(item => item.type === 'block')
    if (blockSection !== undefined) {
      return JSON.parse(blockSection.content) as BlockMeta
    }

    return new JsFileParser().parseContent(blockFile?.script?.content || '')
  }

  private readBlockFile(blockPath: string): SFCDescriptor {
    const content = fs.readFileSync(blockPath).toString('utf-8')
    return parse({
      source: content,
      compiler: templateCompiler as VueTemplateCompiler,
      needMap: false,
    })
  }
}

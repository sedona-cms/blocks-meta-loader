import * as fs from 'fs'
import path from 'path'
import { VueFileParser } from './parsers/vue-file-parser'
import { JsFileParser } from './parsers/js-file-parser'
import { BlockMeta } from './meta'

export class BlocksMetaLoader {
  async getMetaFromFile(filePath: string | readonly string[]): Promise<BlockMeta[] | BlockMeta> {
    if (typeof filePath === 'string') {
      return await this.parseSingleFile(filePath)
    } else if (Array.isArray(filePath)) {
      const promises = filePath.map(item => this.parseSingleFile(item))
      return await Promise.all(promises)
    }

    throw new Error(`Blocks file path is incorrect. ${filePath}`)
  }

  async getMetaFromDirectory(directoryPath: string): Promise<BlockMeta[]> {
    if (!fs.existsSync(directoryPath)) {
      throw new Error(`Path ${directoryPath} not exists`)
    }
    const files = fs.readdirSync(directoryPath)
    const promises = files.map(
      file => this.getMetaFromFile(path.resolve(directoryPath, file)) as Promise<BlockMeta>
    )

    return await Promise.all(promises)
  }

  private async parseSingleFile(filePath: string): Promise<BlockMeta> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Block file does not exists in ${filePath}`)
    }
    const stat = fs.statSync(filePath)
    if (stat.isFile()) {
      switch (path.extname(filePath)) {
        case '.js':
          return Promise.resolve(new JsFileParser().parseFile(filePath))
        case '.vue': {
          return Promise.resolve(new VueFileParser().parse(filePath))
        }
      }
    }

    throw new Error(`Error parsing single component`)
  }
}

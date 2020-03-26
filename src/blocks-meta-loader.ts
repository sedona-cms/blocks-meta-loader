import * as fs from 'fs'
import * as path from 'path'

export class BlocksMetaLoader {
  async getMetaFromFile(filePath: string | string[]): Promise<boolean> {
    if (typeof filePath === 'string') {
      return await this.parseSingleFile(filePath)
    } else if (Array.isArray(filePath)) {
      const promises = filePath.map(item => this.parseSingleFile(item))
      const result = await Promise.all(promises)
      console.log(result)
    }

    return true
  }

  getMetaFromDirectory(directoryPath: string) {}

  private async parseSingleFile(filePath: string): Promise<any> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Block file does not exists in ${filePath}`)
    }
    return Promise.resolve('ok')
  }
}

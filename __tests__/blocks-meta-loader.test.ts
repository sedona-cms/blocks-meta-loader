import * as path from 'path'
import { BlocksMetaLoader } from '../src'

const blocksMetaLoader = new BlocksMetaLoader()

test('load block from single file', async () => {
  const blockFilePath = path.resolve(__dirname, 'stubs/text-block.vue')
  const blockMeta = await blocksMetaLoader.getMetaFromFile(blockFilePath)

  expect(blockMeta).toBeTruthy()
})

test('load block from not exists single file', () => {
  const blockFilePath = path.resolve(__dirname, 'stubs/wring-file-path.vue')

  expect(blocksMetaLoader.getMetaFromFile(blockFilePath)).rejects.toThrow()
})

test('load block from list files', async () => {
  const blockMeta = await blocksMetaLoader.getMetaFromFile([
    path.resolve(__dirname, 'stubs/text-block.vue'),
    path.resolve(__dirname, 'stubs/feature-block.js'),
  ])

  expect(blockMeta).toBeTruthy()
})

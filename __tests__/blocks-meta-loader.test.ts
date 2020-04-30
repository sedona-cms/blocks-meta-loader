import * as path from 'path'
import { BlocksMetaLoader } from '../src'

const blocksMetaLoader = new BlocksMetaLoader()

test('load block from single file', async () => {
  const blockFilePath = path.resolve(__dirname, 'stubs/text-block.vue')
  const blockMeta = await blocksMetaLoader.getMetaFromFile(blockFilePath)

  expect(blockMeta).toMatchSnapshot()
})

test('load block from single js file', async () => {
  const blockFilePath = path.resolve(__dirname, 'stubs/feature-block.js')
  const blockMeta = await blocksMetaLoader.getMetaFromFile(blockFilePath)

  expect(blockMeta).toMatchSnapshot()
})

test('load block from not exists single file', () => {
  const blockFilePath = path.resolve(__dirname, 'stubs/wrong-file-path.vue')

  expect(blocksMetaLoader.getMetaFromFile(blockFilePath)).rejects.toThrow()
})

test('load block with bad type argument', () => {
  // @ts-ignore
  expect(blocksMetaLoader.getMetaFromFile(123)).rejects.toThrow()
})

test('load block from list files', async () => {
  const blockMeta = await blocksMetaLoader.getMetaFromFile([
    path.resolve(__dirname, 'stubs/text-block.vue'),
    path.resolve(__dirname, 'stubs/feature-block.js'),
  ])

  expect(blockMeta).toMatchSnapshot()
})

test('load blocks from directory', async () => {
  const blocksPath = path.resolve(__dirname, 'stubs')
  const blockMeta = await blocksMetaLoader.getMetaFromDirectory(blocksPath)

  expect(blockMeta).toMatchSnapshot()
})

test('load blocks from wrong directory', () => {
  const blocksPath = path.resolve(__dirname, 'wrong-path')

  expect(blocksMetaLoader.getMetaFromDirectory(blocksPath)).rejects.toThrow()
})

test('load block from vue file without a meta information provided', async () => {
  const blocksPath = path.resolve(__dirname, 'stubs/hero-block.vue')
  const meta = await blocksMetaLoader.getMetaFromFile(blocksPath)

  expect(meta).toHaveProperty('name', 'HeroBlock')
  expect(meta).toHaveProperty('title', 'Hero Block')
  expect(meta).toHaveProperty('group', 'general')
  expect(meta).toHaveProperty('props', {})
  expect(meta).toHaveProperty('path', 'hero-block')
})

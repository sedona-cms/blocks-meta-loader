# Blocks Meta Loader

![NPM publish](https://github.com/sedona-cms/blocks-meta-loader/workflows/NPM%20publish/badge.svg)

Loads meta information from vue components for Sedona CMS block editor.

May be used for component libraries that may be used in admin UI Sedona CMS.

## General

The meta information of the block is not necessary to specifically describe. It will be automatically received when parsing the component file.
But it can be supplemented in a custom section in vue file or in a separate json file.
## Example

will be soon

## Install

`npm i -D @sedona-cms/blocks-meta-loader`

## Usage

```typescript
import { BlocksMetaLoader, BlockMeta } from '@sedona-cms/blocks-meta-loader'

const loader = new BlocksMetaLoader()
const blocksMeta: BlockMeta[] = loader.getMetaFromFile('<path-to-vue-component>')

/// blocksMeta may be looks like this

`Array [
  Object {
     "group": "general",
     "name": "<Block Name>",
     "props": Object {
       "color": Object {
         "default": "",
         "required": true,
         "title": "Color",
         "type": "string",
       },
     },
     "title": "Pretty Block Name",
   },]`

```

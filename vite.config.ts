import { resolve } from 'path'

import { defineConfig } from 'vite'

function resolveRelativePath(relative: string): string {
  return resolve(__dirname, relative)
}

export default defineConfig({
  build: {
    lib: {
      entry: resolveRelativePath('src/index.ts'),
      formats: ['es'],
      name: 'fews-web-oc-utils',
      fileName: 'fews-web-oc-utils'
    }
  }
})

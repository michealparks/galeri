import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import terserConfig from './scripts/terser'

const { DEV = false } = process.env

export default [{
  input: './electron/index.ts',
  output: {
    file: './electron.cjs',
    format: 'cjs',
  },
  external: [
    'electron',
    'fs',
    'crypto',
    'util',
    'path',
    'child_process',
    'os'
  ].concat(DEV ? [
    'wallpaper',
    'cheerio',
    'electron-unhandled',
    'electron-reloader',
    'electron-util',
    'electron-serve',
    'svelte/store'
  ]: []),
  plugins: [
    json(),
    DEV === false && nodeResolve({ preferBuiltins: true }),
    DEV === false && commonjs(),
    DEV === false && copy({
      targets: [{ src: [
        'node_modules/wallpaper/source/macos-wallpaper',
        'node_modules/wallpaper/source/win-wallpaper.exe'
      ], dest: 'build' }]
    }),
    typescript(),
		replace({ DEV, preventAssignment: true }),
		DEV === false && terser(terserConfig),
    DEV === false && filesize()
  ]
}]

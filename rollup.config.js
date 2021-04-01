import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const { DEV = false } = process.env

export default [{
  input: './electron/index.ts',
  output: {
    file: './build/electron.js',
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
    'cheerio'
  ]: []),
  plugins: [
    DEV === false && json(),
    DEV === false && nodeResolve({ preferBuiltins: true }),
    DEV === false && commonjs(),
    typescript(),
		replace({ DEV, preventAssignment: true }),
		DEV === false && terser()
  ]
}]

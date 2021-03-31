import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const { DEV = false } = process.env

export default [{
  input: './electron/index.ts',
  output: {
    file: './build/index.js',
    format: 'cjs',
  },
  external: [
    'electron',
    'wallpaper',
    'htmlparser2',
    'cross-fetch',
    'node-fetch',
    'fs',
    'crypto',
    'util',
    'path',
    'file-type',
    'jsdom'
  ],
  plugins: [
    typescript(),
		replace({ DEV, preventAssignment: true }),
		DEV === false && terser()
  ]
}]

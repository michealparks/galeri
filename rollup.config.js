import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
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
    'wallpaper',
    'fs',
    'crypto',
    'util',
    'path',
    'child_process',
    'file-type',
    'jsdom',
    'os'
  ],
  plugins: [
    typescript(),
		replace({ DEV, preventAssignment: true }),
		DEV === false && terser()
  ]
}]

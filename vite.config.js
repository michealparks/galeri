import { defineConfig } from "vite"
import { version } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  plugins: [
    {
      transformIndexHtml: (html) => html.replace(/__VERSION__/, version)
    },
  ],
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    modulePreload: {
      polyfill: false,
    },
    // Tauri supports es2021
    target: ['es2021'],
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
    rollupOptions: {
      input: {
        about: 'about.html',
      },
    },
  },
})

import { defineConfig } from 'vite'
import sveltePlugin from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [sveltePlugin()],
	build: {
		outDir: 'build',
		emptyOutDir: false,
		rollupOptions: {
			input: {
				app: 'app.html',
				about: 'about.html'
			}
		}
	}
})

import { defineConfig } from 'vite'
import sveltePlugin from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [sveltePlugin()],
	base: './',
	build: {
		outDir: 'build',
		emptyOutDir: false,
		rollupOptions: {
			input: {
				app: './app.html',
				about: './about.html',
				favorites: './favorites.html'
			}
		}
	},
	resolve: {
		alias: [
			{ find: '$apis', replacement: resolve('.', 'apis') },
			{ find: '$src', replacement: resolve('.', 'src') },
			{ find: '$lib', replacement: resolve('.', 'lib') },
			{ find: '$electron', replacement: resolve('.', 'electron') },
		]
	}
})

import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()],
	base: './',
	build: {
		outDir: 'build',
		emptyOutDir: false,
		rollupOptions: {
			input: {
				app: './app.html',
				about: './about.html',
				favorites: './favorites.html',
			},
		},
	},
	resolve: {
		alias: [
			{ find: '$apis', replacement: path.resolve('.', 'apis') },
			{ find: '$src', replacement: path.resolve('.', 'src') },
			{ find: '$lib', replacement: path.resolve('.', 'lib') },
			{ find: '$electron', replacement: path.resolve('.', 'electron') },
		],
	},
})

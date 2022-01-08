import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
	],
	base: './',
	build: {
		outDir: 'build',
		emptyOutDir: false,
		rollupOptions: {
			input: {
				about: './about.html',
				favorites: './favorites.html'
			}
		}
	}
})

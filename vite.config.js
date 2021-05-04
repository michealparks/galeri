import { defineConfig } from 'vite'
import sveltePlugin from '@sveltejs/vite-plugin-svelte'

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
	}
})

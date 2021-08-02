<script lang='ts'>
	import { afterUpdate } from 'svelte'

	export let src: string

	export let enabled = false
	let firstEnabled = false
	let loaded = false

	afterUpdate(() => {
		if (enabled === true && firstEnabled === false) {
			const img = new Image()
			img.onload = () => { loaded = true }
			img.src = src
			firstEnabled = true
		}
	})
</script>

<div
	style='background-image: url({src})'
	class={`
		absolute top-0 left-0 w-full h-full pointer-events-none
		opacity-0 transform scale-100 bg-cover bg-center
	`}
	class:visible={enabled && loaded}
/>

<style>
	div {
		will-change: transform, opacity;
	}

	div.visible {
		opacity: 1;
	}

	div {
		transition: transform 300ms, opacity 500ms;
	}
</style>
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
	class:visible={enabled && loaded}
/>

<style>
	div {
		pointer-events: none;
		opacity: 0;
		transform: scale(1.0);
		will-change: transform, opacity;
	}

	div.visible {
		opacity: 1;
	}

	div, div::after {
		background-size: cover;
		background-position: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transition: transform 300ms, opacity 500ms;
	}

	div::after {
		content: '';
		background: rgba(0, 0, 0, 0.2)
	}
</style>
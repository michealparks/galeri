<script lang='ts'>
import { afterUpdate } from "svelte";


	export let src: string
	export let enabled: boolean

	const img = new Image()
	img.onload = () => { loaded = true }

	let loaded = false

	afterUpdate(() => {
		if (enabled) {
			img.src = src
		} else {
			loaded = false
		}
	})

</script>

<div
	style='background-image: url({src})'
	class:loaded
/>

<style>
	div {
		opacity: 0;
		transform: scale(1.0);
		will-change: transform, opacity;
	}

	div.loaded {
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
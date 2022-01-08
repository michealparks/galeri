<script lang='ts'>
	import '../lib/polyfill'
	import { onMount } from 'svelte'
	import Buttons from '../lib/Buttons.svelte'
	import Info from '../lib/Info.svelte'
	import { storage } from '../lib/storage'
	import { current, currentImage } from '../../apis/store'

	let url: string

	const img = document.createElement('img')

	onMount(async () => {
		await storage.init()

		currentImage.subscribe((blob: Blob) => {
			url = URL.createObjectURL(blob)
			img.src = url
		})
	})
</script>

<main
	class='absolute w-screen h-screen bg-black bg-center bg-cover transition-opacity duration-300'
	style={url === undefined ? undefined : `background-image: url(${url})`}
>
	<Buttons {img} />

	{#if $current}
		<Info {...$current} />
	{/if}
</main>


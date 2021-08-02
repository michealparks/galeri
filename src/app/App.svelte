<script lang='ts'>
	import '../lib/polyfill'
	import { onMount } from 'svelte'
	import Buttons from '../lib/Buttons.svelte'
	import Info from '../lib/Info.svelte'
	import { storage } from '../lib/storage'
	import { current, currentImage } from '../../apis/store'

	let url: string

	onMount(async () => {
		await storage.init()

		currentImage.subscribe((blob) => {
			url = URL.createObjectURL(blob)
		})
	})
</script>

<main
	class='absolute h-screen w-screen bg-black bg-center bg-cover'
	style={url === undefined ? undefined : `background-image: url(${url})`}
>
	<Buttons />
	<Info current={$current} />
</main>

<svelte:head>
	<title>New Tab</title>
</svelte:head>

<script lang="ts">
	import '$lib/polyfill'
	import { onMount } from 'svelte'
	import Buttons from '$lib/Buttons.svelte'
	import Info from '$lib/Info.svelte'
	import { storage } from '$lib/storage'
	import store from '../../apis/store'

	const { current } = store

	let url: string

	onMount(async () => {
		await storage.init()

		store.currentImage.subscribe(blob => {
			url = URL.createObjectURL(blob)
		})
	})
</script>

<main
	style={url === undefined ? undefined : `background-image: url(${url})`}
>
	<Buttons />
	<Info {...$current} />
</main>

<style>
	main {
		position: absolute;
		width: 100vw;
		height: 100vh;
		background-color: black;
		background-position: center;
		background-size: cover;
		transition: opacity 300ms;
	}
</style>

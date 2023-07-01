<script lang='ts'>

import { onMount } from 'svelte'
import Buttons from '../lib/Buttons.svelte'
import Info from '../lib/Info.svelte'
import { storage } from '../lib/storage'
import { currentStore, currentImageStore } from '../../apis/store'

let url: string

onMount(async () => {
	await storage.init()

	currentImageStore.subscribe((blob) => {
		url = URL.createObjectURL(blob as Blob)
	})
})

</script>

<main
	class='absolute h-screen w-screen bg-black bg-center bg-cover'
	style={url === undefined ? undefined : `background-image: url(${url})`}
>
	<Buttons />
	<Info current={$currentStore} />
</main>

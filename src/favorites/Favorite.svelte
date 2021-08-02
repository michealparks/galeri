<script lang='ts'>
	import type { ArtObject } from '../../apis/types'
	import Image from './Image.svelte'
	import Arrow from './Arrow.svelte'
	import Delete from './Delete.svelte'

	export let favorite: ArtObject
	export let index: number
	export let enabled: boolean
</script>

<section
	class='overflow-hidden relative h-30 py-3 px-5 rounded-md'
	id={favorite.id}
	data-link={favorite.titleLink}
>
	<Image {enabled} src={favorite.src} />
	<h2 class='relative pointer-events-none text-2xl my-0'>{favorite.title}</h2>
	<h3 class='relative pointer-events-none my-0'>{favorite.artist}</h3>
	<p class='relative pointer-events-none my-0 text-sm'>{favorite.provider}</p>
	<Arrow />
	<Delete {index} />
</section>

<style>
	section {
		background-color: #222;
	}

	section:hover :global(div) {
		transform: scale(1.1)
	}

	section :global(svg) {
		opacity: 0;
		transition: opacity 300ms, transform 300ms;
	}

	section :global(.icon-link) {
		transform: translate(-25px, 25px);
	}

	section:hover :global(svg) {
		opacity: 1;
		transform: translate(0, 0)
	}
</style>

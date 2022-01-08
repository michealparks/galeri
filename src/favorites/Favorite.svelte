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
	id={favorite.id}
	class='overflow-hidden relative h-80 px-2.5 pt-10 pb-4 rounded text-white bg-slate-800'
	data-link={favorite.titleLink}
>
	<Image {enabled} src={favorite.src} />
	<h2>{favorite.title}</h2>
	<h3>{favorite.artist}</h3>
	<p>{favorite.provider}</p>
	<Arrow />
	<Delete {index} />
</section>

<style>
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

	h2, h3, p {
		pointer-events: none;
		position: relative;
		margin: 5px 0;
	}

	p {
		font-weight: 300;
	}
</style>
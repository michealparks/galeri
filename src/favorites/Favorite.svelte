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
	data-id={favorite.id}
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
	section {
		overflow: hidden;
		position: relative;
    height: 300px;
		padding: 10px 35px 10px 15px;
    border-radius: 4px;
		color: #fff;
		background-color: #222;
	}

	section :global(*) {
		pointer-events: none;
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

	h2, h3, p {
		position: relative;
		margin: 5px 0;
	}

	p {
		font-weight: 300;
	}
</style>
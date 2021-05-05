<script lang='ts'>
	import type { ArtObject } from '../../apis/types'
	import Arrow from './Arrow.svelte'
	import Delete from './Delete.svelte'

	export let favorite: ArtObject
	export let index: number
</script>

<section data-link={favorite.titleLink}>
	<div style='background-image: url({favorite.src})' />
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
	}

	section * {
		pointer-events: none;
	}

	div {
		transform: scale(1.0);
		will-change: transform;
	}

	section:hover div {
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

	div, div::after {
		background-size: cover;
		background-position: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transition: transform 300ms;
	}

	div::after {
		content: '';
		background: rgba(0, 0, 0, 0.2)
	}

	h2, h3, p {
		position: relative;
		margin: 5px 0;
	}

	p {
		font-weight: 300;
	}
</style>
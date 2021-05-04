<script lang='ts'>
	import type { ArtObject } from '../../apis/types'
	import testList from './test-list'

	// @ts-ignore
	const { ipcRenderer, shell } = window

	let favorites: ArtObject[] = testList

	ipcRenderer?.on('update', (list: ArtObject[]) => {
		console.log(list)
		favorites = list
	})

	const handleClick = (e: MouseEvent) => {
		console.log(e)
		if (
			e.target instanceof HTMLElement &&
			e.target.dataset?.link
		) {
			e.stopImmediatePropagation()
			shell.openExternal(e.target.dataset.link)
		}
	}
</script>

<main>
	{#each favorites as favorite}
		<section
			data-link={favorite.titleLink}
			on:click={handleClick}
		>
			<div style='background-image: url({favorite.src})' />
			<h2>{favorite.title}</h2>
			<h3>{favorite.artist}</h3>
			<p>{favorite.provider}</p>
		</section>
	{/each}
</main>


<style>
	main {
		overflow-y: auto;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		column-gap: 10px;
  	row-gap: 10px;
		width: 800px;
		height: 500px;
		padding: 10px;
		background-color: #333;
	}

	section {
		overflow: hidden;
		position: relative;
		width: 250px;
    height: 300px;
		padding: 10px 15px;
    border-radius: 4px;
		color: #fff;
	}

	div {
		transform: scale(1.0);
		will-change: transform;
	}

	section:hover div {
		transform: scale(1.1)
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
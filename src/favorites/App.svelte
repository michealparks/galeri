<script lang='ts'>
	import type { ArtObject } from '../../apis/types'
	import Favorite from './Favorite.svelte'
import testList from './test-list';

	// @ts-ignore
	// If in an electron environment, this will be defined in
	// build/preload.js. If in the extension, @TODO
	const { messageService, openLink } = window

	let favorites: ArtObject[] = testList

	messageService?.on('update', (list: ArtObject[]) => {
		favorites = list
	})

	const handleClick = (e: MouseEvent) => {
		if (
			e.target instanceof SVGElement ||
			e.target instanceof HTMLElement
		) {
			const { dataset } = e.target

			if (
				dataset.delete !== undefined &&
				dataset.index !== undefined
			) {
				favorites.splice(parseInt(dataset.index, 10), 1)
				favorites = favorites
				messageService?.send('favorites:delete', favorites)
			}

			if (dataset.link !== undefined) {
				e.stopImmediatePropagation()
				openLink?.(e.target.dataset.link)
			}
		}
	}
</script>

<main on:click={handleClick}>
	{#each favorites as favorite, index (favorite.src)}
		<Favorite {index} {favorite} />
	{/each}
</main>


<style>
	main {
		overflow-y: auto;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		column-gap: 10px;
  	row-gap: 10px;
		width: 100vw;
		height: 100vh;
		padding: 10px;
		background-color: #333;
	}
</style>
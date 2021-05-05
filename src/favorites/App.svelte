<script lang='ts'>
	import type { ArtObject } from '../../apis/types'
	import Favorite from './Favorite.svelte'
	import Dialog from './Dialog.svelte'
	import testList from './test-list'

	// @ts-ignore
	// If in an electron environment, this will be defined in
	// build/preload.js. If in the extension, @TODO
	const { messageService, openLink } = window

	let undoTimeout: NodeJS.Timeout | undefined
	let deleted: ArtObject | undefined
	let deletedIndex: number
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
				handleDelete(parseInt(dataset.index, 10))
			}

			if (dataset.link !== undefined) {
				e.stopImmediatePropagation()
				openLink?.(e.target.dataset.link)
			}
		}
	}

	const handleDelete = (index: number) => {
		deleted = favorites.splice(index, 1)[0]
		deletedIndex = index
		favorites = favorites

		if (undoTimeout) {
			clearTimeout(undoTimeout)
		}

		undoTimeout = setTimeout(handleUndoTimeout, 1000 * 10)

		messageService?.send('favorites:update', favorites)
	}

	const handleUndo = () => {
		if (deleted === undefined) return

		favorites.splice(deletedIndex, 0, deleted)
		favorites = favorites
		deleted = undefined

		if (undoTimeout) {
			clearTimeout(undoTimeout)
		}

		messageService?.send('favorites:update', favorites)
	}

	const handleUndoTimeout = () => {
		deleted = undefined
		undoTimeout = undefined
	}
</script>

<main on:click={handleClick}>
	{#each favorites as favorite, index (favorite.src)}
		<Favorite {index} {favorite} />
	{/each}
</main>

{#if deleted}
	<Dialog on:undo={handleUndo} />
{/if}

<style lang='scss'>
	:global(body) {
		overflow-y:auto
	}
	main {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-rows: 300px;
		grid-gap: 10px;
		width: 100vw;
		padding: 10px;
	}
</style>
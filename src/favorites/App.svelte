<script lang='ts'>
	import type { ArtObject } from '../../apis/types'

	import Favorite from './Favorite.svelte'
	import Dialog from './Dialog.svelte'
	import testList from './test-list'
	import { onMount } from 'svelte'


	// If in an electron environment, this will be defined in
	// build/preload.js. If in the extension, @TODO
	const {
		// @ts-ignore
		messageService,
		// @ts-ignore
		openLink = (url) => {
			console.log(url)
			window.open(url)
		}
	} = window

	let undoTimeout: NodeJS.Timeout | undefined
	let deleted: ArtObject | undefined
	let deletedIndex: number
	let favorites: ArtObject[] = testList
	let enabled = new Map()

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

			console.log(e.target)

			if (dataset.link !== undefined) {
				e.stopImmediatePropagation()
				openLink(e.target.dataset.link)
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

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				const image = entry.target as HTMLImageElement
				const wasEnabled = enabled.get(image.dataset.id)

				if (entry.isIntersecting && wasEnabled !== true) {
					enabled.set(image.dataset.id, true)
					enabled = enabled
				} else if (wasEnabled === true) {
					enabled.set(image.dataset.id, false)
					enabled = enabled
				}
			}
		})

		for (const section of document.querySelectorAll('section')) {
			observer.observe(section)
		}
	})
</script>

<main on:click={handleClick}>
	{#each favorites as favorite, index (favorite.id)}
		<Favorite enabled={enabled.get(favorite.id) || false} {index} {favorite} />
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
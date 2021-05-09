<script lang='ts'>
	import type { ArtObject } from '../../apis/types'

	import Favorite from './Favorite.svelte'
	import Dialog from './Dialog.svelte'
	import testList from './test-list'
	import { tick } from 'svelte'

	// If in an electron environment, this will be defined in
	// build/preload.js. If in the extension, @TODO
	const {
		// @ts-ignore
		messageService,
		// @ts-ignore
		openLink = (url) => window.open(url)
	} = window

	const observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			const section = entry.target as HTMLElement
			const wasEnabled = enabled.get(section.id)

			if (entry.isIntersecting === true && wasEnabled !== true) {
				enabled.set(section.id, true)
				enabled = enabled
			} else if (wasEnabled === true) {
				enabled.set(section.id, false)
				enabled = enabled
			}
		}
	})

	let undoTimeout: NodeJS.Timeout | undefined
	let deleted: ArtObject | undefined
	let deletedIndex: number
	let favorites: ArtObject[] = []
	let enabled = new Map()

	const handleUpdate = async (list: ArtObject[]) => {
		const oldids = favorites.map(({ id }) => id)
		const ids = list.map(({ id }) => id)
		const newids = ids.filter(id => oldids.includes(id) === false)

		favorites = list

		await tick()

		for (const id of newids) {
			console.log(id)
			const section = document.getElementById(id)!
			observer.observe(section)
		}
	}

	const handleClick = (e: MouseEvent) => {
		if (
			e.target instanceof SVGElement ||
			e.target instanceof HTMLElement
		) {
			const { dataset } = e.target

			console.log(e.target)

			if (
				dataset.delete !== undefined &&
				dataset.index !== undefined
			) {
				return handleDelete(parseInt(dataset.index, 10))
			}

			if (dataset.link !== undefined) {
				return openLink(e.target.dataset.link)
			}
		}
	}

	const handleDelete = (index: number) => {
		deleted = favorites.splice(index, 1)[0]

		observer.unobserve(document.getElementById(deleted.id)!)
	
		deletedIndex = index
		favorites = favorites

		if (undoTimeout !== undefined) {
			clearTimeout(undoTimeout)
		}

		undoTimeout = setTimeout(handleUndoTimeout, 1000 * 10)

		messageService?.send('favorites:update', favorites)
	}

	const handleUndo = async () => {
		if (deleted === undefined) return

		favorites.splice(deletedIndex, 0, deleted)
		favorites = favorites

		if (undoTimeout !== undefined) {
			clearTimeout(undoTimeout)
		}

		messageService?.send('favorites:update', favorites)

		await tick()

		observer.observe(document.getElementById(deleted.id)!)

		handleUndoTimeout()
	}

	const handleUndoTimeout = () => {
		deleted = undefined
		deletedIndex = -1
		undoTimeout = undefined
	}

	if (messageService !== undefined) {
		messageService.on('update', handleUpdate)
	} else {
		handleUpdate(testList)
	}
	
</script>

<main on:click={handleClick}>
	{#each favorites as favorite, index (favorite.id)}
		<Favorite
			{index}
			{favorite}
			enabled={enabled.get(favorite.id)}
		/>
	{/each}
</main>

{#if deleted}
	<Dialog on:undo={handleUndo} />
{/if}

<style>
	:global(body) {
		overflow-y: auto;
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
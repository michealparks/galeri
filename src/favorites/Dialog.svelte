<script lang='ts'>
	import { createEventDispatcher } from 'svelte'
	import { fly } from 'svelte/transition'
	import { quartIn, quartOut } from 'svelte/easing'

	const dispatch = createEventDispatcher()
</script>

<div class='fixed bottom-0 w-screen flex justify-center pointer-events-none'>
	<section
		class='pointer-events-auto flex items-center px-2 py-4 mb-4 rounded-3xl text-white text-sm'
		in:fly='{{ y: 200, duration: 500, easing: quartOut }}'
		out:fly='{{ y: 200, duration: 500, easing: quartIn }}'
	>
		Favorite removed
		<button
			class='px-3 py-1.5 border border-white rounded bg-transparent text-sm font-normal text-white'
			on:click={() => dispatch('undo')}
		>
			Undo
		</button>
	</section>
</div>

<style>
	section {
		background: rgba(130,141,255,1);
	}
</style>
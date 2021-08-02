<script lang='ts'>
	import { createEventDispatcher } from 'svelte'
	import { fly } from 'svelte/transition'
	import { quartIn, quartOut } from 'svelte/easing'

	const dispatch = createEventDispatcher()
</script>

<div class='pointer-events-none fixed bottom-0 w-screen flex justify-center text-white mb-3'>
	<section
		class='pointer-events-auto flex items-center py-2 px-6 rounded-full text-sm'
		in:fly='{{ y: 200, duration: 500, easing: quartOut }}'
		out:fly='{{ y: 200, duration: 500, easing: quartIn }}'
	>
		Favorite removed
		<button
			class='ml-2 rounded-lg py-1 px-3 border border-white bg-transparent'
			on:click={() => dispatch('undo')}
		>
			Undo
		</button>
	</section>
</div>

<style>
	section {
		background: rgba(130, 141, 255, 1);
	}
</style>

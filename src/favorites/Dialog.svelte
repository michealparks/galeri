<script lang='ts'>
	import { createEventDispatcher } from 'svelte'
	import { fly } from 'svelte/transition'
	import { quartIn, quartOut } from 'svelte/easing'

	const dispatch = createEventDispatcher()
</script>

<div>
	<section
		in:fly='{{ y: 200, duration: 500, easing: quartOut }}'
		out:fly='{{ y: 200, duration: 500, easing: quartIn }}'
	>
		Favorite removed
		<button on:click={() => dispatch('undo')}>
			Undo
		</button>
	</section>
</div>

<style>
	div {
		pointer-events: none;
		position: fixed;
		bottom: 0;
		width: 100vw;
		display: flex;
		justify-content: center;
	}

	section {
		pointer-events: auto;
		display: flex;
		align-items: center;
		padding: 8px 16px;
		margin: 0 0 15px 0;
		border-radius: 30px;
		background: rgba(130,141,255,1);
		color: white;
		font-size: 14px;
	}

	button {
		padding: 5px 10px;
		margin: 0 0 0 10px;
		border: 1px solid white;
		border-radius: 5px;
		background: none;
		font-size: inherit;
		font-weight: inherit;
		color: white;
	}
</style>
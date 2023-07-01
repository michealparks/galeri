<script lang='ts'>

import type { ArtObject } from '../../apis/types'

export let current: ArtObject = {
	id: '',
	src: '',
	provider: '',
	providerLink: ''
}

</script>

<div class='gradient z-10 absolute bottom-0 right-0 w-32 h-32' />

<section class='information z-20 absolute bottom-0 right-0 text-white text-right text-sm p-3'>
	{#if current.title}
		<a
			class='block opacity-75 hover:opacity-100'
			target='_tab'
			class:clickable={current.titleLink !== undefined}
			href={current.titleLink}
		>
			{current.title}
		</a>
	{/if}

	{#if current.artist}
		<a
			class='block opacity-75 hover:opacity-100'
			target='_tab'
			class:clickable={current.artistLink !== undefined}
			href={current.artistLink}
		>
			by {current.artist}
		</a>
	{/if}

	{#if current.provider}
		<a
			class='block opacity-75 hover:opacity-100'
			target='_tab'
			class:clickable={current.providerLink !== undefined}
			href={current.providerLink}
		>
			from {current.provider}
		</a>
	{/if}
</section>

<style>

.gradient {
  background-image: radial-gradient(
    circle farthest-side at bottom right,
    rgba(0,0,0,0.7),
    transparent);
}


a {
	margin-bottom: 3px;
	color: inherit;
	text-decoration: none;
  opacity: 0.65;
  transition: 100ms opacity;
	pointer-events: none;
}

a.clickable {
	pointer-events: auto;
}

</style>

<script lang='ts'>
	import Link from './Link.svelte'

	export let title: string | undefined
	export let titleLink: string | undefined
	export let artist: string | undefined
	export let artistLink: string | undefined
	export let provider: string | undefined
	export let providerLink: string | undefined
</script>

<div class='z-10 absolute bottom-0 right-0 h-96 w-96 gradient' />

<section class='z-20 absolute bottom-0 right-0 flex flex-col p-2.5 text-right text-white text-sm'>
	{#if title}
		<Link href={titleLink}>{title}</Link>
	{/if}

	{#if artist}
		<Link href={artistLink}>by {artist}</Link>
	{/if}

	{#if provider}
		<Link href={providerLink}>from {provider}</Link>
	{/if}
</section>

<style>
.gradient {
  background-image: radial-gradient(
    circle farthest-side at bottom right,
    rgba(0,0,0,0.7),
    transparent);
}
</style>

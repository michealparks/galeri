<script lang='ts'>
	export let src: string
	export let title: string | undefined
	export let titleLink: string | undefined
	export let artist: string | undefined
	export let artistLink: string | undefined
	export let provider: string | undefined
	export let providerLink: string | undefined
</script>

<div class='gradient' />

<section class="information">
	{#if title}
		<a
			target="_tab" 
			class:clickable={titleLink !== undefined}
			href={titleLink}
		>
			{title}
		</a>
	{/if}

	{#if artist}
		<a
			target="_tab"
			class:clickable={artistLink !== undefined}
			href={artistLink}
		>
			by {artist}
		</a>
	{/if}

	{#if provider}
		<a
			target="_tab"
			class:clickable={providerLink !== undefined}
			href={providerLink}
		>
			from {provider}
		</a>
	{/if}
</section>

<style>
.gradient {
	z-index: 1;
  position: absolute;
  bottom: 0;
  right: 0;
  height: 450px;
  width: 450px;
  background-image: radial-gradient(
    circle farthest-side at bottom right,
    rgba(0,0,0,0.7),
    transparent);
}

.information {
  z-index: 2;
  color: #fff;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 10px;
  text-align: right;
  font-size: 13px;
}

a {
	display: block;
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

a:hover {
  opacity: 1.0;
}
</style>

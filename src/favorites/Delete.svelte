<script lang='ts'>
	export let index: number
</script>

<svg
	data-index={index}
	data-delete="true"
	class="icon-delete"
	viewBox="0 0 24 24"
>
	<path fill=#fff d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path>
</svg>

<style>
	svg {
		position: absolute;
		top: 5px;
		right: 0;
		width: 50px;
		padding: 12px;
	}

	path {
		pointer-events: none;
	}
</style>
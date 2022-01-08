<script lang='ts'>
	import { version } from '../../package.json'
	import Logo from './logo.svelte'
</script>

<div class='titlebar h-10 w-full top-0 left-0' />

<header class='flex justify-center items-center'>
	<Logo />
	<h1 class='mb-2.5 text-5xl'>Galeri</h1>
</header>

<p>A perpetual artwork streaming app</p>
<small>Made with ❤️ in New York City</small>
<p>v{version}</p>

<style>
	:global(body) {
		overflow: hidden;
  	color: #fff;
		display: grid;
		place-content: center;
		text-align: center;
	}
	h1 {
		opacity: 0;
		animation-name: move-right;
		animation-duration: 400ms;
		animation-delay: 300ms;
		animation-fill-mode: forwards;
		animation-timing-function: cubic-bezier(0.165, 0.840, 0.440, 1.000);
	}

	@keyframes move-right {
		0%   { transform: translate(-15px, 0); opacity: 0; }
		100% { transform: translate(0, 0);  opacity: 1; }
	}
</style>

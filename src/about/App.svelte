<script lang='ts'>

import { version } from '../../package.json'
import Logo from './Logo.svelte'

</script>

<div class='titlebar w-full top-0 left-0 h-[40px]' />

<header class='flex justify-center items-center mb-3'>
	<Logo />
	<h1 class='ml-3 text-4xl opacity-0'>Galeri</h1>
</header>

<p>A perpetual artwork streaming app</p>
<small>Made with ❤️ in New York City</small>
<p>v{version}</p>

<style>
	:global(body) {
		@apply overflow-hidden;
		@apply grid;
		@apply place-content-center;
		@apply text-center;
		@apply text-white;
	}

	.titlebar {
		-webkit-app-region: drag;
	}

	h1 {
		animation-name: move-right;
		animation-duration: 400ms;
		animation-delay: 300ms;
		animation-fill-mode: forwards;
		animation-timing-function: cubic-bezier(0.165, 0.840, 0.440, 1.000);
	}

	@keyframes move-right {
		0% {
			transform: translate(-15px, 0);
			opacity: 0;
		}
		100% {
			transform: translate(0, 0);
			opacity: 1;
		}
	}
</style>

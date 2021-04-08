<script lang='ts'>
	import { onMount } from 'svelte'
	import { version } from '../../package.json'

	let date = new Date().getFullYear()

	const reset = () => {

	}

	onMount(() => { date = new Date().getFullYear() })
</script>

<div class='titlebar' />

<header>
	<img alt='Logo' src='galeri-256.png' />
	<h1>Galeri</h1>
</header>

<p>A perpetual artwork streaming app</p>
<small>© {date} Micheal Parks.</small>
<p>v{version}</p>

<small on:click={reset} hidden>Delete User Data</small>

<style>
	:global(body) {
		background-color: #333;
  	color: #fff;
		display: grid;
		place-content: center;
		text-align: center;
	}

	.titlebar {
		-webkit-app-region: drag;
		height: 40px;
		width: 100%;
		top: 0;
		left: 0;
	}

	header {
		display: flex;
		justify-content: center;
  	align-items: center;
	}

	img {
		height: 60px;
		width: 60px;
		opacity: 0;
		transform: translate(15px, 0);
		animation-name: move-left;
		animation-duration: 700ms;
		animation-fill-mode: forwards;
		border: 5px solid #eee;
		border-radius: 100%;
	}

	@keyframes move-left {
		0%   { transform: scale(0.0) translate(15px, 0); opacity: 0; }
		60%  { transform: scale(1.05) translate(0, 0); }
		80%  { transform: scale(0.97) translate(0, 0); }
		100% { transform: scale(1.0) translate(0, 0); opacity: 1; } 
	}

	h1 {
		margin: 0 0 0 10px;
  	font-size: 45px;
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
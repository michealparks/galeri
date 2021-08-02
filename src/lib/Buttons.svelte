<script lang='ts'>
  import { apis } from '../../apis'

  let canClick = true

  const handleClick = async () => {
    canClick = false;

    await apis.getArtwork(true)

    canClick = true
  }
</script>

<div class='gradient z-10 absolute bottom-0 left-0 h-36 w-36' />

<svg
  on:click={handleClick}
  class='z-20 absolute bottom-0 left-0 box-content opacity-40 hover:opacity-100'
  class:disabled={canClick === false}
  viewBox="0 0 24 24"
  area-label="Next Image"
>
	<path
    class='text-white fill-current'
    d="M5.6 3.2c-0.2-0.1-0.4-0.2-0.6-0.2-0.6 0-1 0.4-1 1v16c0 0.2 0.1 0.4 0.2 0.6 0.3 0.4 1 0.5 1.4 0.2l10-8c0.1 0 0.1-0.1 0.2-0.2 0.3-0.4 0.3-1.1-0.2-1.4zM6 6.1l7.4 5.9-7.4 5.9zM18 5v14c0 0.6 0.4 1 1 1s1-0.4 1-1v-14c0-0.6-0.4-1-1-1s-1 0.4-1 1z" />
</svg>

<style>
.gradient {
  background-image: radial-gradient(
    circle farthest-side at bottom left,
    rgba(0, 0, 0, 0.4),
    transparent);
}

svg {
  width: 18px;
  padding: 12px;
  transition: 200ms opacity, 400ms transform;
}

svg.disabled,
svg:hover.disabled {
  pointer-events: none;
  opacity: 0.4;
}
</style>
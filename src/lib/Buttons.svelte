<script>
  import { apis } from '../../apis'

  let canClick = true

  const handleClick = async () => {
    canClick = false
    await apis.getArtwork(true)
    canClick = true
  }
</script>

<div class='gradient' />

<svg
  on:click={handleClick}
  class:disabled={canClick === false}
  viewBox="0 0 24 24"
  area-label="Next Image"
>
	<path d="M5.6 3.2c-0.2-0.1-0.4-0.2-0.6-0.2-0.6 0-1 0.4-1 1v16c0 0.2 0.1 0.4 0.2 0.6 0.3 0.4 1 0.5 1.4 0.2l10-8c0.1 0 0.1-0.1 0.2-0.2 0.3-0.4 0.3-1.1-0.2-1.4zM6 6.1l7.4 5.9-7.4 5.9zM18 5v14c0 0.6 0.4 1 1 1s1-0.4 1-1v-14c0-0.6-0.4-1-1-1s-1 0.4-1 1z" />
</svg>

<style>
.gradient {
	z-index: 1;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 200px;
  width: 200px;
  background-image: radial-gradient(
    circle farthest-side at bottom left,
    rgba(0,0,0,0.4),
    transparent);
}

svg {
	all: initial;
  z-index: 2;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 18px;
  padding: 12px;
  fill: #fff;
  color: white;
  font-family: inherit;
  opacity: 0.4;
  border-radius: 4px;
  font-size: 11px;
  transition: 200ms opacity, 400ms transform;
}

svg:hover {
  opacity: 1.0;
}

svg.disabled,
svg:hover.disabled {
  pointer-events: none;
  opacity: 0.4;
}
</style>
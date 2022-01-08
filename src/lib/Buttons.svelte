<script lang='ts'>
  import { apis } from '../../apis'

  export let img: HTMLImageElement

  let canClick = img.complete

  img.addEventListener('load', () => setTimeout(() => {
    canClick = true
  }, 400))

  const handleClick = async () => {
    canClick = false
    await apis.getArtwork(true)
  }
</script>

<div class='z-10 absolute bottom-0 left-0 h-48 w-48 gradient' />

<button
  type='button'
  title='Next image'
  class='cursor-default z-20 absolute bottom-0 left-0 p-3 transition duration-200 opacity-50 hover:opacity-100'
  on:click={handleClick}
  disabled={canClick === false}
  class:pointer-events-none={canClick === false}
  class:opacity-40={canClick === false}
>
  <svg class='w-5' viewBox='0 0 24 24'>
    <path fill='#fff' d='M5.6 3.2c-0.2-0.1-0.4-0.2-0.6-0.2-0.6 0-1 0.4-1 1v16c0 0.2 0.1 0.4 0.2 0.6 0.3 0.4 1 0.5 1.4 0.2l10-8c0.1 0 0.1-0.1 0.2-0.2 0.3-0.4 0.3-1.1-0.2-1.4zM6 6.1l7.4 5.9-7.4 5.9zM18 5v14c0 0.6 0.4 1 1 1s1-0.4 1-1v-14c0-0.6-0.4-1-1-1s-1 0.4-1 1z' />
  </svg>
</button>

<style>
.gradient {
  background-image: radial-gradient(
    circle farthest-side at bottom left,
    rgba(0,0,0,0.6),
    transparent);
}
</style>

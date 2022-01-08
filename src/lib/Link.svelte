<script lang='ts'>
  export let href: string | undefined
</script>

<a
  target='_tab'
  class='no-underline opacity-60 hover:opacity-100 transition-opacity duration-200'
  class:pointer-events-none={href === undefined}
  href={href}
>
  <slot />
</a>

<script lang="ts">
  import { untrack } from 'svelte'
  import type { AppearanceSettings, Slide } from '@/config/types'
  import type { CaptionState } from './captions'
  import SlideCaption from './SlideCaption.svelte'

  let { caption, slides, appearance }: { caption: CaptionState; slides: Slide[]; appearance: AppearanceSettings } = $props()
  let items = $state.raw(untrack(() => [{ ...caption, leaving: false }]))

  // Keep the previous caption mounted long enough for its exit animation.
  $effect(() => {
    const current = caption
    const previous = untrack(() => items.find((item) => !item.leaving))
    if (previous?.key === current.key) return
    items = [...(previous ? [{ ...previous, leaving: true }] : []), { ...current, leaving: false }]
    const timer = window.setTimeout(() => { items = items.filter((item) => !item.leaving) }, 650)
    return () => window.clearTimeout(timer)
  })
</script>

{#each items as item (item.key)}
  {@const slide = slides[item.index]}
  {#if slide}<SlideCaption {slide} {appearance} delay={item.delay} leaving={item.leaving} />{/if}
{/each}

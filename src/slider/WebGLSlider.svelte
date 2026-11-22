<script lang="ts">
  import { onMount, untrack } from 'svelte'
  import { ChevronLeft, ChevronRight, ImagePlus } from '@lucide/svelte'
  import { useStudio } from '@/config/studio.svelte'
  import { Renderer } from '@/webgl/Renderer'
  import type { CaptionState } from './captions'
  import { SliderEngine } from './engine'
  import CaptionLayer from './CaptionLayer.svelte'
  import SliderChrome from './SliderChrome.svelte'

  let { urls }: { urls: string[] } = $props()
  const studio = useStudio()
  let root: HTMLDivElement | undefined = $state()
  let canvas: HTMLCanvasElement | undefined = $state()
  let caption = $state.raw<CaptionState>({ index: 0, key: 0, delay: 250 })
  let count = $derived(studio.config.slides.length)
  let overlay = $derived.by(() => {
    const appearance = studio.config.appearance
    const k = (v: number) => `rgba(0,0,0,${(appearance.overlay * v).toFixed(3)})`
    switch (appearance.textPosition) {
      case 'bottomLeft': return `linear-gradient(to top, ${k(0.9)} 0%, ${k(0.35)} 45%, ${k(0.12)} 100%)`
      case 'middleLeft': return `linear-gradient(to right, ${k(0.85)} 0%, ${k(0.25)} 60%, ${k(0.05)} 100%)`
      case 'center': return `radial-gradient(ellipse at center, ${k(0.7)} 0%, ${k(0.3)} 75%)`
    }
  })

  onMount(() => {
    if (!canvas || !root) return
    const renderer = Renderer.create(canvas)
    studio.setWebgl(!!renderer)
    if (renderer) renderer.onTextureStatus = studio.setTextureStatus
    const slider = new SliderEngine(renderer, studio.config, {
      onIndex(index) {
        studio.setActive(index)
        if (caption.index !== index) caption = { index, key: caption.key + 1, delay: 0 }
      },
      onTransitionStart(index, duration) {
        caption = { index, key: caption.key + 1, delay: Math.round(duration * 0.42) }
      },
    })
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => { slider.reducedMotion = motion.matches }
    updateMotion()
    motion.addEventListener('change', updateMotion)
    slider.attach(root)
    studio.setEngine(slider)
    return () => {
      motion.removeEventListener('change', updateMotion)
      slider.destroy()
      studio.setEngine(null)
    }
  })
  $effect(() => {
    const engine = studio.engine
    const current = urls
    untrack(() => engine?.setUrls(current))
  })
</script>

<div
  bind:this={root}
  data-drag={studio.config.interaction.drag && count > 1}
  data-cursor-on={studio.config.fx.cursor}
  class="slider-root relative h-full w-full overflow-hidden bg-[#0b0b0d] select-none"
  style="touch-action: pan-y; container-type: inline-size"
  role="region"
  aria-label="Image slider"
  aria-roledescription="carousel"
>
  <canvas bind:this={canvas} class="absolute inset-0 block h-full w-full"></canvas>
  {#if !studio.webgl}
    {#each urls as url, index (`${index}:${url}`)}
      {#if url}<img src={url} alt="" draggable={false} class="absolute inset-0 size-full object-cover transition-opacity duration-700" style:opacity={index === studio.active ? 1 : 0} />{/if}
    {/each}
  {/if}
  <div class="pointer-events-none absolute inset-0" style:background={overlay}></div>
  {#if count === 0}
    <div class="absolute inset-0 grid place-items-center p-8 text-center">
      <div class="flex max-w-xs flex-col items-center gap-4 text-white/60">
        <span class="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/5"><ImagePlus class="size-6" /></span>
        <p class="text-sm leading-relaxed">No slides yet. Add images in the Slides section of the panel.</p>
      </div>
    </div>
  {:else}
    <div data-parallax class="pointer-events-none absolute inset-0 will-change-transform">
      <CaptionLayer {caption} slides={studio.config.slides} appearance={studio.config.appearance} />
    </div>
  {/if}
  <SliderChrome />
  {#if studio.config.fx.cursor}
    <div data-cursor data-state="idle" aria-hidden="true" class="custom-cursor pointer-events-none absolute top-0 left-0 z-30" style="opacity: 0">
      <div class="cursor-ring">
        {#if studio.config.interaction.drag && count > 1}
          <ChevronLeft class="size-3" strokeWidth={2.5} />
          <span>Drag</span>
          <ChevronRight class="size-3" strokeWidth={2.5} />
        {/if}
      </div>
    </div>
  {/if}
</div>

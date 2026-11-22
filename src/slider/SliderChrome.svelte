<script lang="ts">
  import { ArrowLeft, ArrowRight } from '@lucide/svelte'
  import { useStudio } from '@/config/studio.svelte'

  const studio = useStudio()
  let look = $derived(studio.config.appearance)
  let count = $derived(studio.config.slides.length)
  let autoplay = $derived(studio.config.autoplay.enabled)
  let active = $derived(studio.active)
  let arrows = $derived([
    { label: 'Previous slide', icon: ArrowLeft, enabled: count > 1 && (studio.config.interaction.loop || active > 0), run: () => studio.engine?.prev() },
    { label: 'Next slide', icon: ArrowRight, enabled: count > 1 && (studio.config.interaction.loop || active < count - 1), run: () => studio.engine?.next() },
  ])
  const pad = (n: number) => String(n).padStart(2, '0')
</script>

{#if look.counter && count > 0}
  <div class="pointer-events-none absolute top-6 left-6 flex items-baseline gap-2 font-mono text-white md:top-9 md:left-[5.5cqw]">
    <span class="text-sm">{pad(active + 1)}</span>
    <span class="h-px w-6 self-center bg-white/40"></span>
    <span class="text-[11px] text-white/50">{pad(count)}</span>
  </div>
{/if}
{#if look.indicator !== 'none' && count > 1}
  <div data-no-drag class="absolute bottom-6 left-6 flex items-center md:bottom-9 md:left-[5.5cqw]">
    {#if look.indicator === 'progress'}
      <div class="flex w-[min(42cqw,22rem)] gap-1.5">
        {#each { length: count } as _, i (i)}
          <button type="button" aria-label={`Slide ${i + 1}`} class="group flex-1 py-3" onclick={() => studio.engine?.goTo(i)}>
            <span class="block h-[2px] overflow-hidden rounded-full bg-white/25 transition-colors group-hover:bg-white/50">
              <span
                class="block h-full origin-left"
                data-active-fill={i === active && autoplay ? '' : undefined}
                style:background={look.accent}
                style:transform={i === active && !autoplay ? 'scaleX(1)' : 'scaleX(0)'}
              ></span>
            </span>
          </button>
        {/each}
      </div>
    {:else}
      <div class="flex items-center gap-2">
        {#each { length: count } as _, i (i)}
          <button
            type="button"
            aria-label={`Slide ${i + 1}`}
            class="relative h-2 overflow-hidden rounded-full bg-white/30 transition-[width,background-color] duration-500 hover:bg-white/60"
            style:width={i === active ? '36px' : '8px'}
            onclick={() => studio.engine?.goTo(i)}
          >
            {#if i === active}
              <span data-active-fill={autoplay ? '' : undefined} class="absolute inset-0 origin-left" style:background={look.accent} style:transform={autoplay ? 'scaleX(0)' : 'scaleX(1)'}></span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/if}
{#if look.arrows && count > 1}
  <div data-no-drag class="absolute right-6 bottom-6 flex gap-2 md:right-[5.5cqw] md:bottom-9">
    {#each arrows as { label, icon: Icon, enabled, run } (label)}
      <button
        type="button"
        aria-label={label}
        disabled={!enabled}
        class="grid size-12 place-items-center rounded-full border border-white/20 bg-black/15 text-white backdrop-blur-md transition hover:border-transparent hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-30"
        onclick={run}
      >
        <Icon class="size-[18px]" strokeWidth={1.75} />
      </button>
    {/each}
  </div>
{/if}

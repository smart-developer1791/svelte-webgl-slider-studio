<script lang="ts">
  import { ArrowUpRight } from '@lucide/svelte'
  import type { AppearanceSettings, Slide, TextPosition } from '@/config/types'
  import { contrastText } from '@/lib/color'
  import { FONTS } from './captions'

  let { slide, appearance, delay, leaving }: { slide: Slide; appearance: AppearanceSettings; delay: number; leaving: boolean } = $props()
  const POSITION: Record<TextPosition, { wrap: string; inner: string }> = {
    bottomLeft: { wrap: 'items-end justify-start text-left pb-24 md:pb-28', inner: 'items-start max-w-[min(64rem,80cqw)]' },
    middleLeft: { wrap: 'items-center justify-start text-left', inner: 'items-start max-w-[min(56rem,64cqw)]' },
    center: { wrap: 'items-center justify-center text-center', inner: 'items-center max-w-[min(64rem,82cqw)]' },
  }
  let position = $derived(POSITION[appearance.textPosition])
  let font = $derived(FONTS[appearance.font])
  let letters = $derived(appearance.textAnimation === 'letters')
  let words = $derived.by(() => {
    let index = 0
    return slide.title.split(' ').map((word) => Array.from(word, (text) => ({ text, index: index++ })))
  })
  let external = $derived(/^https?:\/\//i.test(slide.buttonUrl))
  let href = $derived.by(() => {
    const url = slide.buttonUrl
    return /^javascript:/i.test(url.replace(/[\t\r\n]/g, '').replace(/^[\u0000-\u0020]+/, '')) ? '#' : url || '#'
  })
</script>

<div class={`absolute inset-0 flex px-6 pt-20 md:px-[5.5cqw] ${position.wrap}`}>
  <div
    class={`caption cap-${appearance.textAnimation} ${leaving ? 'cap-leave' : ''} flex flex-col ${position.inner}`}
    style:--d={`${delay}ms`}
    style:color={appearance.textColor}
  >
    {#if slide.title}
      <h2
        class={`${letters ? '' : 'cap-item'} text-balance`}
        style:--i="0"
        style:font-family={font.family}
        style:font-weight={font.weight}
        style:letter-spacing={font.tracking}
        style:line-height={font.leading}
        style:font-size={`calc(clamp(2.25rem, ${font.size}cqw, 9.5rem) * ${appearance.textScale})`}
      >
        {#if letters}
          {#each words as word, i}{i ? ' ' : ''}<span class="inline-block whitespace-nowrap">{#each word as letter (letter.index)}<span class="cap-char" style:--c={letter.index}>{letter.text}</span>{/each}</span>{/each}
        {:else}
          {slide.title}
        {/if}
      </h2>
    {/if}
    {#if slide.subtitle}
      <p class="cap-item mt-5 max-w-[34rem] text-[clamp(0.95rem,1.3cqw,1.2rem)] leading-relaxed text-pretty opacity-80" style:--i="2">{slide.subtitle}</p>
    {/if}
    {#if slide.buttonText}
      <a
        data-no-drag
        {href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        class="cap-item pointer-events-auto mt-8 inline-flex items-center gap-3 rounded-full py-2 pr-2 pl-6 text-sm font-semibold transition-transform hover:scale-[1.03] active:scale-[0.98]"
        style:--i="3"
        style:background={appearance.accent}
        style:color={contrastText(appearance.accent)}
      >
        {slide.buttonText}
        <span class="grid size-8 place-items-center rounded-full bg-black/15"><ArrowUpRight class="size-4" /></span>
      </a>
    {/if}
  </div>
</div>

<script lang="ts">
  import { CircleAlert, CircleCheck, Maximize2, Minimize2, SlidersHorizontal } from '@lucide/svelte'
  import { provideStudio } from '@/config/studio.svelte'
  import { contrastText } from '@/lib/color'
  import SettingsPanel from '@/settings/SettingsPanel.svelte'
  import WebGLSlider from '@/slider/WebGLSlider.svelte'
  import { useResolvedUrls } from '@/slider/useResolvedUrls.svelte'

  const studio = provideStudio()
  const images = useResolvedUrls(() => studio.config.slides)
  let main: HTMLElement | undefined = $state()
  let fullscreen = $state(false)
  let panelOpen = $state(window.matchMedia('(min-width: 768px)').matches)
  let accent = $derived(studio.config.appearance.accent)
  let toast = $derived(studio.toast)

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined)
      return
    }
    if (!main?.requestFullscreen || !document.fullscreenEnabled) {
      studio.notify('Fullscreen is unavailable in this window — open the preview in a separate tab', 'error')
      return
    }
    main.requestFullscreen().catch(() => studio.notify('The browser blocked fullscreen mode', 'error'))
  }

  function updateFullscreen() {
    fullscreen = document.fullscreenElement === main
  }

  function onKey(event: KeyboardEvent) {
    if ((event.code !== 'KeyH' && event.code !== 'KeyF') || event.metaKey || event.ctrlKey || event.altKey) return
    if ((event.target as HTMLElement | null)?.closest?.('input, textarea, select, [contenteditable="true"]')) return
    if (event.code === 'KeyF') toggleFullscreen()
    else panelOpen = !panelOpen
  }
</script>

<svelte:window onkeydown={onKey} />
<svelte:document onfullscreenchange={updateFullscreen} />

<div class="flex h-dvh w-full overflow-hidden bg-[#08080a] font-sans text-white" style:--ui-accent={accent} style:--ui-on-accent={contrastText(accent)}>
  <main bind:this={main} class="relative h-full min-w-0 flex-1 bg-[#08080a]">
    <WebGLSlider urls={images.urls} />
    <div class="absolute top-5 right-5 z-20 flex gap-2">
      <button
        type="button"
        aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        title={fullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
        class="grid size-10 place-items-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-xl transition hover:bg-black/50"
        onclick={toggleFullscreen}
      >
        {#if fullscreen}<Minimize2 class="size-4" />{:else}<Maximize2 class="size-4" />{/if}
      </button>
      {#if !panelOpen && !fullscreen}
        <button
          type="button"
          class="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-black/30 pr-4 pl-3.5 text-[13px] font-medium text-white backdrop-blur-xl transition hover:bg-black/50"
          onclick={() => { panelOpen = true }}
        >
          <SlidersHorizontal class="size-4" />
          Settings
          <kbd class="ml-1 hidden rounded border border-white/20 px-1 font-mono text-[10px] text-white/60 md:inline">H</kbd>
        </button>
      {/if}
    </div>
  </main>
  <SettingsPanel open={panelOpen} urls={images.urls} onClose={() => { panelOpen = false }} />
</div>
{#if toast}
  {#key toast.key}
    <div role="status" class="toast fixed bottom-5 left-5 z-50 flex max-w-sm items-center gap-2.5 rounded-xl border border-white/10 bg-[#141417]/95 px-4 py-3 text-[13px] text-white shadow-2xl backdrop-blur-xl">
      {#if toast.kind === 'error'}
        <CircleAlert class="size-4 shrink-0 text-[#ff6b6b]" />
      {:else}
        <CircleCheck class="size-4 shrink-0" style="color: var(--ui-accent)" />
      {/if}
      {toast.message}
    </div>
  {/key}
{/if}

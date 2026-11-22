<script lang="ts">
  import { ChevronDown, ChevronUp, GripVertical, ImageOff, ImagePlus, Images, Link2, Pencil, Trash2 } from '@lucide/svelte'
  import { newSlide } from '@/config/defaults'
  import { deleteImage, putImage } from '@/config/storage'
  import { useStudio } from '@/config/studio.svelte'
  import { EFFECT_IDS, type Slide, type SlideEffect } from '@/config/types'
  import { EFFECTS } from '@/webgl/effects'
  import IconButton from './controls/IconButton.svelte'
  import Section from './controls/Section.svelte'
  import SelectField from './controls/SelectField.svelte'
  import StudioButton from './controls/StudioButton.svelte'
  import TextField from './controls/TextField.svelte'

  let { urls }: { urls: string[] } = $props()
  const studio = useStudio()
  let expanded = $state<string | null>(null)
  let dragFrom = $state<number | null>(null)
  let dropOver = $state(false)
  let url = $state('')
  let fileInput: HTMLInputElement | undefined = $state()
  let slides = $derived(studio.config.slides)
  const effectOptions: { value: SlideEffect; label: string }[] = [
    { value: 'inherit', label: 'Use transition settings' },
    ...EFFECT_IDS.map((id) => ({ value: id, label: EFFECTS[id].name })),
  ]

  function status(index: number) {
    const src = urls[index]
    return src ? studio.statuses[src] : 'error'
  }

  async function addFiles(files: FileList | null | undefined) {
    const images = Array.from(files ?? []).filter((file) => file.type.startsWith('image/'))
    if (!images.length) return
    try {
      const added = await Promise.all(images.map(async (file) => ({ ...newSlide(await putImage(file)), title: file.name.replace(/\.[^.]+$/, '') })))
      studio.dispatch({ type: 'addSlides', slides: added })
      studio.notify(added.length > 1 ? `Slides added: ${added.length}` : 'Slide added')
    } catch {
      studio.notify('Could not save the image in this browser', 'error')
    }
  }

  function onFiles(event: Event & { currentTarget: HTMLInputElement }) {
    void addFiles(event.currentTarget.files)
    event.currentTarget.value = ''
  }

  function addUrl(event: SubmitEvent) {
    event.preventDefault()
    const image = url.trim()
    if (!/^https?:\/\/\S+$/i.test(image)) {
      studio.notify('Enter a URL starting with http:// or https://', 'error')
      return
    }
    studio.dispatch({ type: 'addSlides', slides: [newSlide(image)] })
    url = ''
  }

  function remove(slide: Slide) {
    studio.dispatch({ type: 'removeSlide', id: slide.id })
    if (!slides.some((item) => item.image === slide.image)) void deleteImage(slide.image)
  }

  function updateSlide(id: string, value: Partial<Slide>) {
    studio.dispatch({ type: 'updateSlide', id, value })
  }

  function move(from: number, to: number) {
    studio.dispatch({ type: 'moveSlide', from, to })
  }

  function startDrag(event: DragEvent, index: number) {
    dragFrom = index
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
  }

  function dropSlide(event: DragEvent, to: number) {
    event.preventDefault()
    if (dragFrom !== null) move(dragFrom, to)
    dragFrom = null
  }

  function hoverFiles(event: DragEvent) {
    if (event.dataTransfer?.types.includes('Files')) {
      event.preventDefault()
      dropOver = true
    }
  }

  function dropFiles(event: DragEvent) {
    event.preventDefault()
    dropOver = false
    void addFiles(event.dataTransfer?.files)
  }
</script>

<Section icon={Images} title="Slides" defaultOpen>
  {#snippet aside()}<span class="font-mono text-[11px] text-white/35">{slides.length}</span>{/snippet}
  {#if slides.length}
    <ul class="space-y-1.5">
      {#each slides as slide, i (slide.id)}
        {@const imageStatus = status(i)}
        <li
          draggable="true"
          class={`rounded-xl border transition-colors ${dragFrom === i ? 'opacity-40' : ''} ${i === studio.active ? 'bg-white/[0.045]' : 'border-white/[0.06] hover:border-white/[0.12]'}`}
          style:border-color={i === studio.active ? 'color-mix(in srgb, var(--ui-accent) 55%, transparent)' : undefined}
          ondragstart={(event) => startDrag(event, i)}
          ondragover={(event) => { if (dragFrom !== null) event.preventDefault() }}
          ondrop={(event) => dropSlide(event, i)}
          ondragend={() => { dragFrom = null }}
        >
          <div class="flex items-center gap-2.5 p-2">
            <GripVertical class="size-3.5 shrink-0 cursor-grab text-white/20" />
            <button type="button" title="Show slide" class="relative h-11 w-16 shrink-0 overflow-hidden rounded-md bg-white/5" onclick={() => studio.engine?.goTo(i)}>
              {#if urls[i] && imageStatus !== 'error'}<img src={urls[i]} alt="" draggable={false} class="size-full object-cover" />{/if}
              {#if imageStatus === 'error'}<span class="absolute inset-0 grid place-items-center bg-[#ff5a5a]/15 text-[#ff8c8c]"><ImageOff class="size-4" /></span>{/if}
              <span class="absolute top-1 left-1 rounded bg-black/55 px-1 font-mono text-[9px] text-white">{i + 1}</span>
            </button>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[13px] font-medium text-white/90">{slide.title || 'Untitled'}</p>
              <p class={`truncate text-[11px] ${imageStatus === 'error' ? 'text-[#ff8c8c]' : 'text-white/40'}`}>
                {imageStatus === 'error' ? 'Image failed to load' : slide.effect === 'inherit' ? 'Global effect' : EFFECTS[slide.effect].name}
              </p>
            </div>
            <div class="flex shrink-0">
              <IconButton icon={ChevronUp} label="Move up" disabled={i === 0} onclick={() => move(i, i - 1)} />
              <IconButton icon={ChevronDown} label="Move down" disabled={i === slides.length - 1} onclick={() => move(i, i + 1)} />
              <IconButton icon={Pencil} label="Edit" aria-expanded={expanded === slide.id} onclick={() => { expanded = expanded === slide.id ? null : slide.id }} />
              <IconButton icon={Trash2} label="Delete" onclick={() => remove(slide)} />
            </div>
          </div>
          {#if expanded === slide.id}
            <div class="space-y-3.5 border-t border-white/[0.06] p-3">
              <TextField label="Title" value={slide.title} onValueChange={(title) => updateSlide(slide.id, { title })} />
              <TextField label="Subtitle" multiline value={slide.subtitle} onValueChange={(subtitle) => updateSlide(slide.id, { subtitle })} />
              <div class="grid grid-cols-2 gap-2">
                <TextField label="Button text" value={slide.buttonText} placeholder="Leave empty to hide" onValueChange={(buttonText) => updateSlide(slide.id, { buttonText })} />
                <TextField label="Link" value={slide.buttonUrl} placeholder="https://" onValueChange={(buttonUrl) => updateSlide(slide.id, { buttonUrl })} />
              </div>
              <SelectField label="Transition into this slide" value={slide.effect} options={effectOptions} onValueChange={(effect) => updateSlide(slide.id, { effect })} />
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
  <button
    type="button"
    class={`flex w-full flex-col items-center gap-1.5 rounded-xl border border-dashed px-4 py-5 text-center transition-colors ${dropOver ? 'bg-white/[0.06]' : 'border-white/15 hover:border-white/30 hover:bg-white/[0.025]'}`}
    style:border-color={dropOver ? 'var(--ui-accent)' : undefined}
    onclick={() => fileInput?.click()}
    ondragover={hoverFiles}
    ondragleave={() => { dropOver = false }}
    ondrop={dropFiles}
  >
    <ImagePlus class="size-5 text-white/50" strokeWidth={1.75} />
    <span class="text-[12.5px] font-medium text-white/80">Drop images or choose files</span>
    <span class="text-[11px] text-white/35">JPG, PNG, WebP — stored in this browser</span>
  </button>
  <input bind:this={fileInput} type="file" accept="image/*" multiple hidden onchange={onFiles} />
  <form class="flex gap-2" onsubmit={addUrl}>
    <div class="relative flex-1">
      <Link2 class="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-white/35" />
      <input bind:value={url} placeholder="Image URL" class="field pl-8" />
    </div>
    <StudioButton type="submit" disabled={!url.trim()}>Add</StudioButton>
  </form>
</Section>

<script lang="ts">
  import { Bookmark, Plus, Trash2 } from '@lucide/svelte'
  import { createId } from '@/config/defaults'
  import { BUILT_IN_PRESETS } from '@/config/presets'
  import { useStudio } from '@/config/studio.svelte'
  import { loadPresets, pickSettings, savePresets } from '@/config/storage'
  import type { Preset } from '@/config/types'
  import { EFFECTS } from '@/webgl/effects'
  import IconButton from './controls/IconButton.svelte'
  import Section from './controls/Section.svelte'
  import StudioButton from './controls/StudioButton.svelte'

  const studio = useStudio()
  let custom = $state.raw<Preset[]>(loadPresets())
  let name = $state('')

  function apply(preset: Preset) {
    studio.dispatch({ type: 'applyPreset', settings: preset.settings })
    studio.notify(`Preset “${preset.name}” applied`)
  }

  function persist(list: Preset[]) {
    custom = list
    if (!savePresets(list)) studio.notify('Could not save the preset', 'error')
  }

  function save(event: SubmitEvent) {
    event.preventDefault()
    const preset = {
      id: createId(),
      name: name.trim() || `My preset ${custom.length + 1}`,
      settings: pickSettings(studio.config),
    }
    persist([...custom, preset])
    name = ''
    studio.notify(`Preset “${preset.name}” saved`)
  }
</script>

<Section icon={Bookmark} title="Presets">
  <div class="grid grid-cols-2 gap-1.5">
    {#each BUILT_IN_PRESETS as preset (preset.id)}
      <button
        type="button"
        class="group flex items-center gap-2.5 rounded-lg border border-white/[0.06] p-2 text-left transition-colors hover:border-white/15 hover:bg-white/[0.03]"
        onclick={() => apply(preset)}
      >
        <span class="size-8 shrink-0 rounded-md" style:background={`radial-gradient(circle at 30% 30%, ${preset.settings.appearance.accent}, #111 75%)`}></span>
        <span class="min-w-0">
          <span class="block text-[12.5px] font-semibold text-white/90">{preset.name}</span>
          <span class="block truncate text-[10.5px] text-white/40">{EFFECTS[preset.settings.transition.effect].name}</span>
        </span>
      </button>
    {/each}
  </div>
  {#if custom.length}
    <ul class="space-y-1">
      {#each custom as preset (preset.id)}
        <li class="flex items-center gap-2 rounded-lg bg-white/[0.03] py-1 pr-1 pl-3">
          <button type="button" class="flex-1 truncate text-left text-[12.5px] text-white/85 hover:text-white" onclick={() => apply(preset)}>{preset.name}</button>
          <IconButton icon={Trash2} label="Delete preset" onclick={() => persist(custom.filter((entry) => entry.id !== preset.id))} />
        </li>
      {/each}
    </ul>
  {/if}
  <form class="flex gap-2" onsubmit={save}>
    <input bind:value={name} placeholder="Preset name" class="field flex-1" />
    <StudioButton type="submit" icon={Plus}>Save</StudioButton>
  </form>
</Section>

<script lang="ts">
  import { Database, Download, RotateCcw, Upload } from '@lucide/svelte'
  import { defaultConfig } from '@/config/defaults'
  import { useStudio } from '@/config/studio.svelte'
  import { exportConfig, importConfig } from '@/config/storage'
  import Section from './controls/Section.svelte'
  import StudioButton from './controls/StudioButton.svelte'

  const studio = useStudio()
  let fileInput: HTMLInputElement | undefined = $state()
  let busy = $state(false)

  async function doExport() {
    busy = true
    try {
      const blob = await exportConfig(studio.config)
      const anchor = document.createElement('a')
      anchor.href = URL.createObjectURL(blob)
      anchor.download = 'webgl-slider.json'
      anchor.click()
      window.setTimeout(() => URL.revokeObjectURL(anchor.href), 1000)
    } catch {
      studio.notify('Could not export the configuration', 'error')
    } finally {
      busy = false
    }
  }

  async function doImport(event: Event & { currentTarget: HTMLInputElement }) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    busy = true
    try {
      studio.dispatch({ type: 'replace', config: await importConfig(await file.text()) })
      studio.notify('Configuration imported')
    } catch (error) {
      studio.notify(error instanceof SyntaxError ? 'The file is not valid JSON' : error instanceof Error ? error.message : 'Import failed', 'error')
    } finally {
      busy = false
    }
  }

  function reset() {
    if (window.confirm('Reset all settings and slides to their defaults?')) {
      studio.dispatch({ type: 'replace', config: defaultConfig() })
      studio.notify('Settings reset')
    }
  }
</script>

<Section icon={Database} title="Data">
  <p class="text-[11.5px] leading-relaxed text-white/45">
    Settings are saved automatically in this browser. Export creates a JSON file including uploaded images.
  </p>
  <div class="grid grid-cols-2 gap-2">
    <StudioButton icon={Download} disabled={busy} onclick={doExport}>Export</StudioButton>
    <StudioButton icon={Upload} disabled={busy} onclick={() => fileInput?.click()}>Import</StudioButton>
  </div>
  <input bind:this={fileInput} type="file" accept="application/json,.json" hidden onchange={doImport} />
  <StudioButton variant="danger" icon={RotateCcw} class="w-full" onclick={reset}>Reset all</StudioButton>
</Section>

<script lang="ts">
  import { Palette } from '@lucide/svelte'
  import { useStudio } from '@/config/studio.svelte'
  import { FONT_IDS } from '@/config/types'
  import { FONTS } from '@/slider/captions'
  import ColorField from './controls/ColorField.svelte'
  import RangeField from './controls/RangeField.svelte'
  import Section from './controls/Section.svelte'
  import Segmented from './controls/Segmented.svelte'
  import Toggle from './controls/Toggle.svelte'
  import { percent } from './formats'

  const studio = useStudio()
  const { patch } = studio
  let look = $derived(studio.config.appearance)
  const fonts = FONT_IDS.map((id) => ({ value: id, label: FONTS[id].label }))
  const animations = [
    { value: 'letters', label: 'Letters' },
    { value: 'fadeUp', label: 'Fade up' },
    { value: 'blurIn', label: 'Blur in' },
  ] as const
  const positions = [
    { value: 'bottomLeft', label: 'Bottom' },
    { value: 'middleLeft', label: 'Left' },
    { value: 'center', label: 'Center' },
  ] as const
  const indicators = [
    { value: 'progress', label: 'Progress' },
    { value: 'dots', label: 'Dots' },
    { value: 'none', label: 'None' },
  ] as const
</script>

<Section icon={Palette} title="Appearance">
  <Segmented label="Heading font" value={look.font} options={fonts} onValueChange={(value) => patch('appearance', { font: value })} />
  <Segmented label="Text entrance" value={look.textAnimation} options={animations} onValueChange={(value) => patch('appearance', { textAnimation: value })} />
  <Segmented label="Text position" value={look.textPosition} options={positions} onValueChange={(value) => patch('appearance', { textPosition: value })} />
  <RangeField label="Text size" value={look.textScale} min={0.5} max={1.6} step={0.01} format={percent} onValueChange={(value) => patch('appearance', { textScale: value })} />
  <div class="grid grid-cols-2 gap-3">
    <ColorField label="Text color" value={look.textColor} onValueChange={(value) => patch('appearance', { textColor: value })} />
    <ColorField label="Accent" value={look.accent} onValueChange={(value) => patch('appearance', { accent: value })} />
  </div>
  <RangeField label="Text backdrop" value={look.overlay} min={0} max={1} step={0.01} format={percent} onValueChange={(value) => patch('appearance', { overlay: value })} />
  <RangeField label="Film grain" value={look.grain} min={0} max={1} step={0.01} format={percent} onValueChange={(value) => patch('appearance', { grain: value })} />
  <RangeField label="Vignette" value={look.vignette} min={0} max={1} step={0.01} format={percent} onValueChange={(value) => patch('appearance', { vignette: value })} />
  <Segmented label="Indicator" value={look.indicator} options={indicators} onValueChange={(value) => patch('appearance', { indicator: value })} />
  <Toggle label="Arrows" value={look.arrows} onValueChange={(value) => patch('appearance', { arrows: value })} />
  <Toggle label="Slide counter" value={look.counter} onValueChange={(value) => patch('appearance', { counter: value })} />
</Section>

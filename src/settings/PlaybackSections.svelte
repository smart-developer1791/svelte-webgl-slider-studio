<script lang="ts">
  import { Clapperboard, MousePointer2, Timer } from '@lucide/svelte'
  import { useStudio } from '@/config/studio.svelte'
  import RangeField from './controls/RangeField.svelte'
  import Section from './controls/Section.svelte'
  import Toggle from './controls/Toggle.svelte'
  import { percent, seconds } from './formats'

  const studio = useStudio()
  const { patch } = studio
  let fx = $derived(studio.config.fx)
  let interaction = $derived(studio.config.interaction)
  let autoplay = $derived(studio.config.autoplay)
  const decimal = (v: number) => v.toFixed(2)
  const multiplier = (v: number) => `×${v.toFixed(2)}`
</script>

<Section icon={Clapperboard} title="Cinematic effects" defaultOpen>
  <RangeField label="Ken Burns — slow zoom" value={fx.kenBurns} min={0} max={1} step={0.01} format={percent} onValueChange={(value) => patch('fx', { kenBurns: value })} />
  <RangeField label="Depth parallax" value={fx.parallax} min={0} max={1} step={0.01} format={percent} onValueChange={(value) => patch('fx', { parallax: value })} />
  <RangeField label="Ambient motion" value={fx.ambient} min={0} max={1} step={0.01} format={percent} onValueChange={(value) => patch('fx', { ambient: value })} />
  <RangeField label="Lens aberration" value={fx.chroma} min={0} max={1} step={0.01} format={percent} onValueChange={(value) => patch('fx', { chroma: value })} />
  <Toggle label="Custom cursor" hint="A Drag ring that shrinks over buttons" value={fx.cursor} onValueChange={(value) => patch('fx', { cursor: value })} />
</Section>
<Section icon={MousePointer2} title="Interaction">
  <Toggle label="Cursor distortion" hint="Lens and RGB shift driven by pointer speed" value={interaction.hover} onValueChange={(value) => patch('interaction', { hover: value })} />
  {#if interaction.hover}
    <RangeField label="Strength" value={interaction.hoverStrength} min={0} max={2} step={0.01} format={percent} onValueChange={(value) => patch('interaction', { hoverStrength: value })} />
    <RangeField label="Radius" value={interaction.hoverRadius} min={0.05} max={1} step={0.01} format={decimal} onValueChange={(value) => patch('interaction', { hoverRadius: value })} />
  {/if}
  <Toggle label="Drag and swipe" hint="The transition follows your finger with inertia" value={interaction.drag} onValueChange={(value) => patch('interaction', { drag: value })} />
  {#if interaction.drag}<RangeField label="Sensitivity" value={interaction.dragSensitivity} min={0.3} max={3} step={0.05} format={multiplier} onValueChange={(value) => patch('interaction', { dragSensitivity: value })} />{/if}
  <Toggle label="Mouse wheel and trackpad" value={interaction.wheel} onValueChange={(value) => patch('interaction', { wheel: value })} />
  <Toggle label="Arrow keys ← →" value={interaction.keyboard} onValueChange={(value) => patch('interaction', { keyboard: value })} />
  <Toggle label="Infinite loop" value={interaction.loop} onValueChange={(value) => patch('interaction', { loop: value })} />
</Section>
<Section icon={Timer} title="Autoplay">
  {#snippet aside()}<span class="font-mono text-[11px] text-white/35">{autoplay.enabled ? 'on' : 'off'}</span>{/snippet}
  <Toggle label="Enable autoplay" value={autoplay.enabled} onValueChange={(value) => patch('autoplay', { enabled: value })} />
  <RangeField label="Interval" value={autoplay.interval} min={1500} max={12000} step={250} format={seconds} onValueChange={(value) => patch('autoplay', { interval: value })} />
  <Toggle label="Pause on hover" value={autoplay.pauseOnHover} onValueChange={(value) => patch('autoplay', { pauseOnHover: value })} />
</Section>

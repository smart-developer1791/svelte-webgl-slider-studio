<script lang="ts">
  import { Play, Wand2 } from '@lucide/svelte'
  import { useStudio } from '@/config/studio.svelte'
  import { EASING_IDS, EFFECT_IDS, type EffectId } from '@/config/types'
  import { EASING_LABELS } from '@/webgl/easing'
  import { EFFECTS } from '@/webgl/effects'
  import ColorField from './controls/ColorField.svelte'
  import RangeField from './controls/RangeField.svelte'
  import Section from './controls/Section.svelte'
  import Segmented from './controls/Segmented.svelte'
  import SelectField from './controls/SelectField.svelte'
  import StudioButton from './controls/StudioButton.svelte'
  import Toggle from './controls/Toggle.svelte'
  import { percent, seconds } from './formats'

  const studio = useStudio()
  const { patch, dispatch } = studio
  let transition = $derived(studio.config.transition)
  let effect = $derived(EFFECTS[transition.effect])
  let params = $derived(studio.config.effectParams[transition.effect])
  const easingOptions = EASING_IDS.map((id) => ({ value: id, label: EASING_LABELS[id] }))
  const formatParam = (value: number, step: number) => step >= 1 ? String(value) : value.toFixed(step >= 0.01 ? 2 : 3)

  function chooseEffect(id: EffectId) {
    patch('transition', { effect: id })
    requestAnimationFrame(() => studio.engine?.replay())
  }

  function setParam(index: number, value: number) {
    dispatch({ type: 'effectParam', effect: transition.effect, index, value })
  }

  function resetParams() {
    effect.params.forEach((param, index) => setParam(index, param.default))
  }
</script>

<Section icon={Wand2} title="Transition" defaultOpen>
  <div class="grid grid-cols-2 gap-1.5">
    {#each EFFECT_IDS as id (id)}
      <button
        type="button"
        class={`rounded-lg border px-3 py-2.5 text-left transition-colors ${id === transition.effect ? 'bg-white/[0.06]' : 'border-white/[0.06] hover:border-white/15 hover:bg-white/[0.025]'}`}
        style:border-color={id === transition.effect ? 'var(--ui-accent)' : undefined}
        onclick={() => chooseEffect(id)}
      >
        <span class="block text-[12.5px] font-semibold text-white/90">{EFFECTS[id].name}</span>
        <span class="mt-0.5 block text-[10.5px] leading-snug text-white/40">{EFFECTS[id].description}</span>
      </button>
    {/each}
  </div>
  <Toggle label="Random effect" hint="A new effect for each transition, with no consecutive repeats" value={transition.random} onValueChange={(random) => patch('transition', { random })} />
  <StudioButton variant="primary" icon={Play} class="w-full" disabled={studio.config.slides.length < 2} onclick={() => studio.engine?.replay()}>Play transition</StudioButton>
  <RangeField label="Duration" value={transition.duration} min={300} max={3000} step={50} format={seconds} onValueChange={(duration) => patch('transition', { duration })} />
  <SelectField label="Easing curve" value={transition.easing} options={easingOptions} onValueChange={(easing) => patch('transition', { easing })} />
  <RangeField label="Intensity" value={transition.intensity} min={0} max={2} step={0.01} format={percent} onValueChange={(intensity) => patch('transition', { intensity })} />
  <div class="space-y-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
    <p class="font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">Parameters · {effect.name}</p>
    {#each effect.params as param, i (param.label)}
      {#if param.options}
        <Segmented
          label={param.label}
          value={params[i]}
          options={param.options.map((label, value) => ({ label, value }))}
          onValueChange={(value) => setParam(i, value)}
        />
      {:else}
        <RangeField
          label={param.label}
          value={params[i]}
          min={param.min}
          max={param.max}
          step={param.step}
          format={(value) => formatParam(value, param.step)}
          onValueChange={(value) => setParam(i, value)}
        />
      {/if}
    {/each}
    {#if transition.effect === 'dissolve'}
      <ColorField label="Edge color" value={transition.edgeColor} onValueChange={(edgeColor) => patch('transition', { edgeColor })} />
    {/if}
    <button type="button" class="text-[11px] text-white/40 underline-offset-2 hover:text-white/70 hover:underline" onclick={resetParams}>Reset effect parameters</button>
  </div>
</Section>

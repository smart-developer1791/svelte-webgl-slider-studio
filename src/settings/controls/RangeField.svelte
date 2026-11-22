<script lang="ts">
  import FieldLabel from './FieldLabel.svelte'
  let { label, value, min, max, step, format, onValueChange }: {
    label: string; value: number; min: number; max: number; step: number
    format?: (value: number) => string; onValueChange: (value: number) => void
  } = $props()
  let fill = $derived(`${((value - min) / (max - min)) * 100}%`)
</script>

<label class="block">
  <FieldLabel value={format ? format(value) : value}>{label}</FieldLabel>
  <input type="range" class="range" {min} {max} {step} {value} style:--fill={fill} oninput={(event) => onValueChange(event.currentTarget.valueAsNumber)} />
</label>

<script lang="ts" generics="T extends string">
  import { ChevronDown } from '@lucide/svelte'
  import FieldLabel from './FieldLabel.svelte'
  let { label, value, options, onValueChange }: { label: string; value: T; options: readonly { value: T; label: string }[]; onValueChange: (value: T) => void } = $props()
</script>

<label class="block">
  <FieldLabel>{label}</FieldLabel>
  <div class="relative">
    <select {value} class="field appearance-none pr-8" onchange={(event) => onValueChange(event.currentTarget.value as T)}>
      {#each options as option (option.value)}
        <option value={option.value} class="bg-[#141417]">{option.label}</option>
      {/each}
    </select>
    <ChevronDown class="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-white/40" />
  </div>
</label>

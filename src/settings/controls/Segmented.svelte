<script lang="ts" generics="T extends string | number">
  import FieldLabel from './FieldLabel.svelte'
  let { label, value, options, onValueChange }: { label?: string; value: T; options: readonly { value: T; label: string }[]; onValueChange: (value: T) => void } = $props()
</script>

<div>
  {#if label}<FieldLabel>{label}</FieldLabel>{/if}
  <div class="flex rounded-lg bg-white/[0.05] p-0.5">
    {#each options as option (option.value)}
      <button type="button" class={`flex-1 rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors ${option.value === value ? 'bg-white/[0.12] text-white shadow-sm' : 'text-white/45 hover:text-white/80'}`} onclick={() => onValueChange(option.value)}>
        {option.label}
      </button>
    {/each}
  </div>
</div>

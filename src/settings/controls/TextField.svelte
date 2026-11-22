<script lang="ts">
  import FieldLabel from './FieldLabel.svelte'
  let { label, value, placeholder, multiline, onValueChange }: { label: string; value: string; placeholder?: string; multiline?: boolean; onValueChange: (value: string) => void } = $props()
</script>

<label class="block">
  <FieldLabel>{label}</FieldLabel>
  {#if multiline}
    <textarea {value} {placeholder} rows="2" class="field resize-none leading-relaxed" oninput={(event) => onValueChange(event.currentTarget.value)}></textarea>
  {:else}
    <input {value} {placeholder} class="field" oninput={(event) => onValueChange(event.currentTarget.value)} />
  {/if}
</label>

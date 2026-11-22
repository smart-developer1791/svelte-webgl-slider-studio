<script lang="ts">
  import type { Snippet } from 'svelte'
  let { value, children }: { value?: string | number; children: Snippet } = $props()
</script>

<div class="mb-2 flex items-baseline justify-between gap-3">
  <span class="text-xs text-white/55">{@render children()}</span>
  {#if value !== undefined}<span class="font-mono text-[11px] text-white/85 tabular-nums">{value}</span>{/if}
</div>

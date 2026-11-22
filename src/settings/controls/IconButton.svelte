<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { Trash2 } from '@lucide/svelte'
  let { icon: Icon, label, ...rest }: HTMLButtonAttributes & { icon: typeof Trash2; label: string } = $props()
</script>

<button type="button" aria-label={label} title={label} {...rest} class="grid size-7 place-items-center rounded-md text-white/45 transition hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-25">
  <Icon class="size-3.5" strokeWidth={2} />
</button>

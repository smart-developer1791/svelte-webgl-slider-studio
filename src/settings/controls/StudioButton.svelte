<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { Plus } from '@lucide/svelte'

  let { variant = 'ghost', icon: Icon, type = 'button', class: className = '', children, ...rest }: HTMLButtonAttributes & {
    variant?: 'primary' | 'ghost' | 'danger'; icon?: typeof Plus
  } = $props()
  const styles = {
    primary: 'bg-[var(--ui-accent)] text-[var(--ui-on-accent)] hover:brightness-110',
    ghost: 'bg-white/[0.06] text-white/85 hover:bg-white/[0.1]',
    danger: 'bg-[#ff5a5a]/10 text-[#ff8c8c] hover:bg-[#ff5a5a]/20',
  }
</script>

<button {type} {...rest} class={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3.5 text-[12.5px] font-semibold transition disabled:pointer-events-none disabled:opacity-40 ${styles[variant]} ${className}`}>
  {#if Icon}<Icon class="size-3.5" strokeWidth={2} />{/if}
  {@render children?.()}
</button>

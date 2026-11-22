<script lang="ts">
  import { untrack, type Snippet } from 'svelte'
  import { ChevronDown } from '@lucide/svelte'

  let { icon: Icon, title, defaultOpen = false, aside, children }: {
    icon: typeof ChevronDown
    title: string
    defaultOpen?: boolean
    aside?: Snippet
    children: Snippet
  } = $props()
  let open = $state(untrack(() => defaultOpen))
</script>

<section class="border-b border-white/[0.06]">
  <button type="button" aria-expanded={open} class="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.025]" onclick={() => { open = !open }}>
    <Icon class="size-4 text-white/45" strokeWidth={1.75} />
    <span class="flex-1 text-[13px] font-semibold tracking-tight text-white/90">{title}</span>
    {@render aside?.()}
    <ChevronDown class={`size-4 text-white/35 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
  </button>
  {#if open}
    <div class="space-y-5 px-5 pt-1 pb-6">{@render children()}</div>
  {/if}
</section>

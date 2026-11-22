<script lang="ts">
  import FieldLabel from './FieldLabel.svelte'
  let { label, value, onValueChange }: { label: string; value: string; onValueChange: (value: string) => void } = $props()
  let draft = $state<string | null>(null)

  function edit(event: Event & { currentTarget: HTMLInputElement }) {
    const text = event.currentTarget.value
    draft = text
    if (/^#[0-9a-f]{6}$/i.test(text)) onValueChange(text.toLowerCase())
  }
</script>

<div>
  <FieldLabel>{label}</FieldLabel>
  <div class="flex items-center gap-2">
    <label class="relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/10" style:background={value}>
      <input type="color" {value} aria-label={label} class="absolute inset-0 cursor-pointer opacity-0" oninput={(event) => onValueChange(event.currentTarget.value)} />
    </label>
    <input value={draft ?? value} aria-label={`${label} hex value`} spellcheck={false} class="field font-mono uppercase" oninput={edit} onblur={() => { draft = null }} />
  </div>
</div>

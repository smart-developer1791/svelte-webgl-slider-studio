import { resolveImage, resolveSync } from '@/config/storage'
import type { Slide } from '@/config/types'

export function useResolvedUrls(getSlides: () => Slide[]) {
  let urls = $state.raw(getSlides().map((slide) => resolveSync(slide.image) ?? ''))
  let sourcesKey = $derived(JSON.stringify(getSlides().map((slide) => slide.image)))

  $effect(() => {
    const sources = JSON.parse(sourcesKey) as string[]
    const sync = sources.map(resolveSync)
    urls = sync.map((url) => url ?? '')
    if (sync.every((url) => url !== null)) return
    let cancelled = false
    Promise.all(sources.map(resolveImage)).then((resolved) => {
      if (!cancelled) urls = resolved
    })
    return () => { cancelled = true }
  })

  return { get urls() { return urls } }
}

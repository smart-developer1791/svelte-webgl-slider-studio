import { getContext, onDestroy, setContext, untrack } from 'svelte'
import type { SliderEngine } from '@/slider/engine'
import type { TextureStatus } from '@/webgl/Renderer'
import { reducer, type Action, type SectionKey } from './reducer'
import { loadConfig, saveConfig } from './storage'
import type { SliderConfig } from './types'

type ToastKind = 'success' | 'error'

function createStudio() {
  let config = $state.raw(loadConfig())
  let engine = $state.raw<SliderEngine | null>(null)
  let active = $state(0)
  let webgl = $state(true)
  let statuses = $state.raw<Record<string, TextureStatus>>({})
  let toast = $state.raw<{ message: string; kind: ToastKind; key: number } | null>(null)
  let toastTimer = 0

  function dispatch(action: Action) {
    config = reducer(config, action)
  }

  function patch<K extends SectionKey>(section: K, value: Partial<SliderConfig[K]>) {
    dispatch({ type: 'patch', section, value })
  }

  function notify(message: string, kind: ToastKind = 'success') {
    toast = { message, kind, key: Date.now() }
    window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => { toast = null }, 3200)
  }

  $effect(() => {
    const current = config
    untrack(() => engine?.setConfig(current))
    const timer = window.setTimeout(() => {
      if (!saveConfig(current)) notify('Browser storage is full — settings were not saved', 'error')
    }, 300)
    return () => window.clearTimeout(timer)
  })
  onDestroy(() => window.clearTimeout(toastTimer))

  return {
    get config() { return config },
    get engine() { return engine },
    get active() { return active },
    get webgl() { return webgl },
    get statuses() { return statuses },
    get toast() { return toast },
    setEngine(slider: SliderEngine | null) { engine = slider },
    setActive(index: number) { active = index },
    setWebgl(supported: boolean) { webgl = supported },
    setTextureStatus(url: string, status: TextureStatus) { statuses = { ...statuses, [url]: status } },
    dispatch,
    patch,
    notify,
  }
}

const studioKey = Symbol('slider-studio')

export function provideStudio() {
  return setContext(studioKey, createStudio())
}

export function useStudio() {
  const studio = getContext<ReturnType<typeof createStudio>>(studioKey)
  if (!studio) throw new Error('useStudio must be used inside the slider studio')
  return studio
}

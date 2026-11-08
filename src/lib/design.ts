import { ACTIVE_DESIGN, designs, type DesignId } from '../content/designs'
import { themes } from '../content/themes'

const KEY = 'eb-design'

const read = (k: string) => {
  try {
    return sessionStorage.getItem(k)
  } catch {
    return null
  }
}
const write = (k: string, v: string) => {
  try {
    sessionStorage.setItem(k, v)
  } catch {
    /* storage unavailable: the choice applies to this page view only */
  }
}

export const isDesign = (v: unknown): v is DesignId => designs.some((d) => d.id === v)

/** Sets <html data-design> and the browser UI colour for a design. */
export function applyDesign(id: DesignId) {
  const root = document.documentElement
  root.dataset.design = id
  const meta = document.querySelector('meta[name="theme-color"]')
  const color =
    id === 'classic' ? themes.find((t) => t.id === root.dataset.theme)?.meta : designs.find((d) => d.id === id)?.meta
  if (meta && color) meta.setAttribute('content', color)
}

export function saveDesign(id: DesignId) {
  write(KEY, id)
  write(`${KEY}-on`, '1')
}

/** Whether the preview switch should be shown (dev, or after using ?design=). */
export const designSwitchEnabled = () => import.meta.env.DEV || read(`${KEY}-on`) === '1'

/**
 * Call once before render. Resolves the design from `?design=`, then the
 * tab's saved choice, then ACTIVE_DESIGN, and applies it without a flash.
 */
export function initDesign(): DesignId {
  const url = new URL(location.href)
  const param = url.searchParams.get('design')
  let id: DesignId = ACTIVE_DESIGN
  if (param !== null) {
    if (isDesign(param)) {
      id = param
      saveDesign(param)
    } else if (import.meta.env.DEV) {
      console.warn(`[design] unknown ?design=${param}; using "${ACTIVE_DESIGN}"`)
    }
    url.searchParams.delete('design')
    history.replaceState(history.state, '', url.pathname + url.search + url.hash)
  }
  if (param === null || !isDesign(param)) {
    const saved = read(KEY)
    if (isDesign(saved)) id = saved
  }
  applyDesign(id)
  return id
}

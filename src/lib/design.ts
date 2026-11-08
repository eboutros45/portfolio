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

/** Apply the chosen site design, ignoring previous preview selections. */
export function initDesign(): DesignId {
  applyDesign(ACTIVE_DESIGN)
  return ACTIVE_DESIGN
}

import { m } from 'motion/react'
import { useEffect, useState } from 'react'
import { ACTIVE_THEME, themes, type ThemeId } from '../content/themes'
import { EASE } from './motion'

/**
 * Preview-only colour scheme picker.
 * Visible in `npm run dev`, or on any build when the URL contains `?themes`
 * (remembered for the tab session). Visitors never see it. To ship a
 * scheme, set ACTIVE_THEME in src/content/themes.ts.
 */

const KEY = 'eb-theme-preview'

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
    /* storage unavailable: preview just won't persist */
  }
}

export function applyTheme(id: ThemeId, animate = false) {
  const root = document.documentElement
  if (animate) {
    root.classList.add('theme-transition')
    window.setTimeout(() => root.classList.remove('theme-transition'), 600)
  }
  root.dataset.theme = id
  const meta = document.querySelector('meta[name="theme-color"]')
  const t = themes.find((x) => x.id === id)
  if (meta && t) meta.setAttribute('content', t.meta)
}

/** Call once before render: restores a previewed scheme without a flash. */
export function initThemePreview(): boolean {
  const params = new URLSearchParams(location.search)
  const enabled = import.meta.env.DEV || params.has('themes') || read(`${KEY}-on`) === '1'
  if (!enabled) return false
  write(`${KEY}-on`, '1')
  const fromUrl = params.get('themes')
  const saved = (fromUrl || read(KEY)) as ThemeId | null
  if (saved && themes.some((t) => t.id === saved)) applyTheme(saved)
  return true
}

export function ThemePicker() {
  const [current, setCurrent] = useState<ThemeId>(
    () => (document.documentElement.dataset.theme as ThemeId) || ACTIVE_THEME,
  )

  useEffect(() => {
    applyTheme(current, true)
    write(KEY, current)
  }, [current])

  const active = themes.find((t) => t.id === current)!

  return (
    <m.div
      role="radiogroup"
      aria-label="Colour scheme preview"
      className="fixed bottom-5 left-5 z-[90] flex items-center gap-1 rounded-full border border-line-strong bg-ink-raised/95 p-1.5 pl-4 shadow-[0_20px_40px_-16px_rgb(0_0_0/0.4)] backdrop-blur"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 1.4 }}
    >
      <span className="label mr-2 hidden w-28 text-muted sm:block">{active.name}</span>
      {themes.map((t) => {
        const selected = t.id === current
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={t.name}
            title={t.name}
            onClick={() => setCurrent(t.id)}
            className={`grid size-9 cursor-pointer place-items-center rounded-full transition-[box-shadow] duration-300 ${
              selected ? 'shadow-[0_0_0_1.5px_var(--color-paper)]' : 'hover:shadow-[0_0_0_1px_var(--color-line-strong)]'
            }`}
          >
            <span
              aria-hidden
              className="grid size-6 place-items-center rounded-full shadow-[inset_0_0_0_1px_rgb(128_128_128/0.35)]"
              style={{ background: t.swatch[0] }}
            >
              <span className="size-2 rounded-full" style={{ background: t.swatch[1] }} />
            </span>
          </button>
        )
      })}
    </m.div>
  )
}

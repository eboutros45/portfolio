import { useLayoutEffect, useRef } from 'react'

/**
 * Scales an element's font-size so its widest `[data-fit-line]` child
 * spans the element's full width exactly, edge to edge, at any viewport.
 * Letter-spacing is in `em`, so width scales linearly with font-size and a
 * single measurement is enough. Re-fits on resize and once webfonts load.
 */
export function useFitText<T extends HTMLElement>(fill = 1) {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    let lastWidth = 0

    const fit = () => {
      const width = el.clientWidth
      if (!width) return
      lastWidth = width
      const lines = el.querySelectorAll<HTMLElement>('[data-fit-line]')
      const widest = Math.max(...Array.from(lines, (l) => l.offsetWidth))
      if (!widest) return
      const current = parseFloat(getComputedStyle(el).fontSize)
      el.style.fontSize = `${(current * width * fill) / widest}px`
    }

    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(() => {
      if (el.clientWidth !== lastWidth) fit()
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [fill])

  return ref
}

import type Lenis from 'lenis'

/**
 * Scroll helpers. When Lenis smooth scrolling is active (desktop, motion
 * allowed) every programmatic scroll goes through it so its internal
 * position stays in sync; otherwise native scrolling is used.
 */

let lenis: Lenis | null = null
export const setLenis = (instance: Lenis | null) => {
  lenis = instance
}

const NAV_OFFSET = -72

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function scrollToTop(immediate = false) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true })
  else window.scrollTo({ top: 0, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** Scrolls to an element by id (with or without '#'). Returns false if not found. */
export function scrollToId(hashOrId: string, smooth = true): boolean {
  const id = decodeURIComponent(hashOrId.replace(/^#/, ''))
  if (!id) return false
  const el = document.getElementById(id)
  if (!el) return false
  if (lenis) {
    // Re-measure first: content that just mounted may not be in Lenis's scroll limit yet.
    lenis.resize()
    lenis.scrollTo(el, { offset: NAV_OFFSET, immediate: !smooth, duration: 1.4, force: true })
  } else {
    el.scrollIntoView({ behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto', block: 'start' })
  }
  return true
}

/**
 * Retries until the target exists (e.g. right after a lazy route mounts).
 * Stops as soon as it scrolls, so the generous timeout only matters on a
 * slow first load of a code-split page.
 */
export function scrollToIdWhenReady(hash: string, timeoutMs = 5000) {
  const start = performance.now()
  const tick = () => {
    if (scrollToId(hash, false)) return
    if (performance.now() - start < timeoutMs) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

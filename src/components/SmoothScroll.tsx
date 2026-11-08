import Lenis from 'lenis'
import { useEffect } from 'react'
import { prefersReducedMotion, setLenis } from '../lib/scroll'

/**
 * Inertial smooth scrolling for mouse wheels and trackpads (Lenis).
 * Touch devices keep native scrolling, and it is skipped entirely when
 * the visitor prefers reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, wheelMultiplier: 1 })
    setLenis(lenis)
    return () => {
      setLenis(null)
      lenis.destroy()
    }
  }, [])
  return null
}

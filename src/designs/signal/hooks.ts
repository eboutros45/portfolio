import { useEffect, useState } from 'react'

/**
 * The id of the last element (in document order) whose top has scrolled
 * past `line` (a fraction of the viewport height), or null above the first.
 */
export function useActiveSection(ids: readonly string[], line = 0.4) {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.innerHeight * line
      let current: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= y) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // Re-measure when content mounts or changes height (e.g. a lazy page arrives).
    const ro = new ResizeObserver(onScroll)
    ro.observe(document.body)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, line])

  return active
}

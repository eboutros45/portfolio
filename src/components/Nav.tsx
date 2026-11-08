import { m, useMotionValueEvent, useScroll } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { site } from '../content/site'
import { scrollToTop } from '../lib/scroll'
import { EASE } from './motion'
import { SectionLink } from './SectionLink'

/** Each nav item and the homepage sections that count as "in" it. */
const items = [
  { id: 'work', label: 'Work', sections: ['work', 'explorations'] },
  { id: 'about', label: 'About', sections: ['about', 'experience', 'skills'] },
  { id: 'contact', label: 'Contact', sections: ['contact'] },
]

/**
 * Floating pill navigation. A filled indicator slides to the item for the
 * section currently in view (homepage only), and the pill tucks away while
 * scrolling down fast, returning on scroll up or keyboard focus.
 */
export function Nav() {
  const { pathname } = useLocation()
  const { scrollY } = useScroll()
  const [active, setActive] = useState<string | null>(null)
  const [hidden, setHidden] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)
  const [indicator, setIndicator] = useState({ x: 0, width: 0 })

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > 400 && y > prev + 4 ? true : y < prev - 2 ? false : hidden)

    if (pathname !== '/') return setActive(null)
    const line = window.innerHeight * 0.4
    let current: string | null = null
    for (const item of items) {
      for (const id of item.sections) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = item.id
      }
    }
    // Contact wins once the page bottom is reached
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) current = 'contact'
    setActive(current)
  })

  useLayoutEffect(() => {
    if (pathname !== '/') setActive(null)
  }, [pathname])

  useLayoutEffect(() => {
    const el = active ? listRef.current?.querySelector<HTMLElement>(`[data-nav="${active}"]`) : null
    if (el) setIndicator({ x: el.offsetLeft, width: el.offsetWidth })
  }, [active])

  return (
    <m.header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-4"
      animate={{ y: hidden ? '-120%' : '0%' }}
      transition={{ duration: 0.5, ease: EASE }}
      onFocusCapture={() => setHidden(false)}
    >
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-line-strong bg-ink-raised p-1.5 shadow-[0_12px_32px_-18px_rgb(0_0_0/0.35)]"
      >
        <Link
          to="/"
          aria-label={`${site.name}, home`}
          className="rounded-full px-4 py-2 text-base font-semibold tracking-[-0.04em] transition-colors hover:text-accent"
          onClick={() => pathname === '/' && scrollToTop()}
        >
          {site.monogram}
        </Link>
        <span aria-hidden className="h-4 w-px bg-line-strong" />
        <ul ref={listRef} className="label relative flex items-center">
          <m.li
            aria-hidden
            className="absolute inset-y-0 left-0 rounded-full bg-paper"
            initial={false}
            animate={{ x: indicator.x, width: indicator.width, opacity: active ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
          {items.map((item) => (
            <li key={item.id} data-nav={item.id} className="relative">
              <SectionLink
                to={item.id}
                aria-current={active === item.id ? 'true' : undefined}
                className={`block rounded-full px-3.5 py-2 transition-colors duration-300 sm:px-4 ${
                  active === item.id ? 'text-ink' : 'text-muted hover:text-paper'
                }`}
              >
                {item.label}
              </SectionLink>
            </li>
          ))}
        </ul>
      </nav>
    </m.header>
  )
}

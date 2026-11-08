import './setup'
import { Menu } from 'lucide-react'
import { m, useReducedMotion, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { SectionLink } from '../../components/SectionLink'
import { site } from '../../content/site'
import { scrollToTop } from '../../lib/scroll'
import { CommandMenu } from './CommandMenu'
import { SECTIONS } from './data'
import { useActiveSection } from './hooks'

const ids = SECTIONS.map((s) => s.id)

/**
 * Fixed top bar. The test points (TP1–TP5) light up for the section in
 * view, and a 1px signal line along the bottom edge shows scroll progress.
 * ⌘K / Ctrl+K (or the menu button on mobile) opens the jump menu.
 */
export default function SignalNav() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const active = useActiveSection(onHome ? ids : [])
  const { scrollYProgress } = useScroll()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [mac, setMac] = useState(false)

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent))
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header className="sp-nav">
        <nav aria-label="Primary" className="sp-wrap sp-nav__row">
          <Link
            to="/"
            onClick={(e) => {
              if (onHome) {
                e.preventDefault()
                scrollToTop()
              }
            }}
            className="sp-nav__id"
          >
            {site.name}
            <span className="sp-l5 hidden normal-case tracking-normal sm:inline">/ Computer Engineering · Software</span>
          </Link>

          <ul className="sp-l5 hidden items-center gap-1 lg:flex">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <SectionLink to={s.id} className="sp-tp" aria-current={active === s.id ? 'true' : undefined}>
                  <i aria-hidden />
                  <span>{s.tp}</span>
                  <span className="tracking-normal normal-case">{s.label}</span>
                </SectionLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="sp-kbd sp-l5"
            aria-haspopup="dialog"
            aria-label="Open jump menu"
          >
            <Menu aria-hidden className="size-4 lg:hidden" />
            <span className="hidden lg:inline">{mac ? '⌘K' : 'Ctrl K'}</span>
            <span className="lg:hidden">Menu</span>
          </button>
        </nav>
        <m.span aria-hidden className="sp-progress" style={{ scaleX: reduce ? 0 : scrollYProgress }} />
      </header>
      <CommandMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}

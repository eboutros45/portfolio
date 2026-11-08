import './setup'
import { m, useReducedMotion, useScroll } from 'motion/react'
import { useRef, useState } from 'react'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { About } from './About'
import { CaseStudies } from './CaseStudies'
import { Contact } from './Contact'
import { SECTIONS } from './data'
import { Hero } from './Hero'
import { useActiveSection } from './hooks'
import { Work } from './Work'

const ids = SECTIONS.map((s) => s.id)

export default function SignalHome() {
  useDocumentMeta('/')
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const active = useActiveSection(ids)
  const [highlight, setHighlight] = useState<string | null>(null)

  return (
    <main id="main" ref={ref} className="relative">
      {/* The signal rail: lights up as you move down the page */}
      <div aria-hidden className="sp-rail">
        <m.div className="sp-rail__lit" style={{ scaleY: reduce ? 1 : scrollYProgress }} />
      </div>
      <Hero active={active === 'intro' || active === null} />
      <Work active={active === 'work'} highlight={highlight} />
      <CaseStudies active={active === 'case-studies'} onHighlight={setHighlight} />
      <About active={active === 'about'} />
      <Contact active={active === 'contact'} />
    </main>
  )
}

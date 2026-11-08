import { ArrowDown, ArrowRight } from 'lucide-react'
import { m, useReducedMotion } from 'motion/react'
import { LocalTime } from '../../components/LocalTime'
import { SectionLink } from '../../components/SectionLink'
import { currently } from '../../content/profile'
import { site } from '../../content/site'
import { signalCopy } from './copy'
import { DevPlaceholder, Eyebrow } from './ui'

const EASE = [0.16, 1, 0.3, 1] as const

/** Decorative circuit behind the hero; one trace powers up on load. */
function Circuit() {
  const reduce = useReducedMotion()
  return (
    <svg aria-hidden className="sp-hero__circuit" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="var(--sp-line)" strokeWidth="1.25">
        <path d="M1440 150 H1080 L1040 190 H860" />
        <path d="M1440 330 H1210 L1170 370 V560 L1200 590 H1440" />
        <path d="M980 900 V760 L1010 730 H1240" />
        <path d="M1320 0 V90 L1290 120 H1150" />
        <path d="M640 900 V840 L670 810 H820" />
      </g>
      <g fill="var(--sp-line2)">
        <circle cx="860" cy="190" r="3" />
        <circle cx="1240" cy="730" r="3" />
        <circle cx="1150" cy="120" r="3" />
        <circle cx="820" cy="810" r="3" />
      </g>
      <m.path
        d="M1440 250 H1300 L1260 290 H1120 L1080 330 V470 L1050 500 H960"
        fill="none"
        stroke="var(--sp-sig)"
        strokeWidth="1.5"
        initial={reduce ? false : { pathLength: 0, opacity: 0.2 }}
        animate={{ pathLength: 1, opacity: 0.75 }}
        transition={{ duration: 2.2, ease: EASE, delay: 0.4 }}
      />
      <m.circle
        cx="960"
        cy="500"
        r="4"
        fill="var(--sp-sig)"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      />
    </svg>
  )
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
})

export function Hero({ active }: { active: boolean }) {
  const [before, after] = (() => {
    const i = site.statement.indexOf(signalCopy.heroHighlight)
    return i < 0 ? [site.statement, ''] : [site.statement.slice(0, i), site.statement.slice(i)]
  })()

  return (
    <section id="intro" aria-labelledby="sp-hero-title" className="sp-hero">
      <Circuit />
      <div className="sp-wrap relative z-[1] grid grid-cols-[minmax(0,1fr)] items-end gap-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
        <div className="min-w-0">
          <m.div {...fade(0.1)}>
            <Eyebrow tp="TP1" active={active}>
              <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
                <span>
                  Beirut <span className="sp-tx">
                    <LocalTime />
                  </span>
                </span>
                <span>{signalCopy.educationShort}</span>
                {site.availability ? (
                  <span className="flex items-center gap-2">
                    <span className="sp-dot" aria-hidden />
                    <span className="sp-tx">{site.availability}</span>
                  </span>
                ) : (
                  <DevPlaceholder>availability: set in site.ts</DevPlaceholder>
                )}
              </span>
            </Eyebrow>
          </m.div>

          <m.h1 id="sp-hero-title" className="sp-l1 mt-7" {...fade(0.2)}>
            {before}
            {/* Non-breaking hyphen: "real-world" never splits across lines */}
            <span className="sp-sig">{after.replace(/-/g, '‑')}</span>
          </m.h1>

          <m.p className="sp-lede mt-7" {...fade(0.35)}>
            {signalCopy.heroLede}
          </m.p>

          <m.div className="mt-9 flex flex-wrap gap-3" {...fade(0.5)}>
            <SectionLink to="work" className="sp-btn sp-btn--primary">
              See the work <ArrowDown aria-hidden />
            </SectionLink>
            <SectionLink to="contact" className="sp-btn">
              Get in touch <ArrowRight aria-hidden />
            </SectionLink>
          </m.div>
        </div>

        <m.aside aria-label="Currently" className="sp-panel" {...fade(0.65)}>
          <div className="sp-panel__head sp-l5">
            <span>Currently</span>
            <span className="flex items-center gap-2 sp-sig">
              <span className="sp-dot" aria-hidden /> Live
            </span>
          </div>
          <ul>
            {currently.map((c) => (
              <li key={c.title} className="sp-panel__row">
                {c.title}
                <span>{c.detail}</span>
              </li>
            ))}
          </ul>
        </m.aside>
      </div>

      <m.p
        className="sp-wrap sp-l5 relative z-[1] mt-16 hidden items-center gap-3 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        <ArrowDown aria-hidden className="size-3.5" /> Scroll to power on the work
      </m.p>
    </section>
  )
}

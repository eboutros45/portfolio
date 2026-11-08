import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { currently } from '../content/profile'
import { site } from '../content/site'
import { LocalTime } from '../components/LocalTime'
import { Magnetic } from '../components/Magnetic'
import { EASE, SplitLetters } from '../components/motion'
import { SectionLink } from '../components/SectionLink'
import { useFitText } from '../hooks/useFitText'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: EASE, delay },
})

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const nameRef = useFitText<HTMLHeadingElement>()
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // As the hero scrolls away the name lines slide apart and the rest lifts off.
  const line1X = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const line2X = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const restY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const restOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const p = <T,>(v: T) => (reduce ? undefined : v)

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-page flex min-h-svh flex-col pt-24 pb-10 md:pt-28">
        {/* Meta strip */}
        <m.div {...fadeUp(0.2)} className="label grid-page gap-y-2 border-b border-line pb-4 text-muted">
          <p className="col-span-4 text-paper md:col-span-6">{site.role}</p>
          <p className="col-span-2 md:col-span-3">Based in {site.location}</p>
          <p className="col-span-2 text-right md:col-span-3">
            Local time <LocalTime />
          </p>
        </m.div>

        {/* Name, fitted to the full container width. On wide screens the
            statement + CTAs sit in the open space to the right of "ELIE". */}
        <div className="relative my-auto pt-8 md:pt-10">
          <h1
            id="hero-title"
            ref={nameRef}
            aria-label={site.name}
            className="text-[17vw] leading-[0.8] font-semibold tracking-[-0.055em] uppercase"
          >
            <m.span className="block" style={{ x: p(line1X) }}>
              <span data-fit-line className="inline-block whitespace-nowrap">
                <SplitLetters text="Elie" immediate delay={0.25} stagger={0.06} />
              </span>
            </m.span>
            <m.span className="block" style={{ x: p(line2X) }}>
              <span data-fit-line className="inline-block whitespace-nowrap">
                <SplitLetters text="Boutros." immediate delay={0.4} stagger={0.05} accentLast />
              </span>
            </m.span>
          </h1>

          <m.div
            style={{ y: p(restY), opacity: p(restOpacity) }}
            className="mt-10 xl:absolute xl:top-10 xl:right-0 xl:mt-0 xl:w-[44%]"
          >
            <m.div {...fadeUp(1)}>
              <p className="max-w-xl text-lead font-medium text-balance xl:text-[clamp(1.5rem,1.9vw,2rem)]">
                {site.statement}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Magnetic>
                  <SectionLink
                    to="work"
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-paper py-4 pr-5 pl-6 text-sm font-medium text-ink"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-y-100"
                    />
                    <span className="relative">Explore Projects</span>
                    <span className="relative grid size-6 place-items-center rounded-full bg-ink text-paper">
                      <ArrowDownRight
                        aria-hidden
                        className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:rotate-[-45deg]"
                      />
                    </span>
                  </SectionLink>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <SectionLink to="contact" className="group inline-flex items-center gap-2 py-4 text-sm font-medium">
                    <span className="link-underline">Contact Me</span>
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                    />
                  </SectionLink>
                </Magnetic>
              </div>
            </m.div>
          </m.div>
        </div>

        <m.div style={{ y: p(restY), opacity: p(restOpacity) }} className="grid-page mt-10 items-end gap-y-10 md:mt-8">
          {/* Scroll cue */}
          <m.p {...fadeUp(1.3)} className="label col-span-4 hidden items-center gap-3 text-faint md:col-span-4 md:flex">
            <span aria-hidden className="relative h-10 w-px overflow-hidden bg-line-strong">
              <m.span
                className="absolute inset-x-0 top-0 h-1/2 bg-paper"
                animate={reduce ? undefined : { y: ['-100%', '200%'] }}
                transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.3 }}
              />
            </span>
            Scroll to explore
          </m.p>

          {/* "Currently" status block */}
          <m.div {...fadeUp(1.15)} className="col-span-4 md:col-span-5 md:col-start-8">
            <p className="label mb-4 flex items-center gap-2.5 text-muted">
              <span aria-hidden className="relative flex size-2">
                {!reduce && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                )}
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              Currently
            </p>
            <ul className="divide-y divide-line border-y border-line">
              {currently.map((c, i) => (
                <m.li
                  key={c.title}
                  className="flex items-baseline justify-between gap-4 py-3"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 1.25 + i * 0.08 }}
                >
                  <span className="font-medium">{c.title}</span>
                  <span className="text-right text-sm text-muted">{c.detail}</span>
                </m.li>
              ))}
            </ul>
          </m.div>
        </m.div>
      </div>
    </section>
  )
}

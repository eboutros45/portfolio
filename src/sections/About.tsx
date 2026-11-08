import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { about } from '../content/profile'
import { Section } from '../components/Container'
import { Reveal } from '../components/motion'
import { SectionHeader } from '../components/SectionHeader'

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <m.span className="inline" style={{ opacity }}>
      {children}{' '}
    </m.span>
  )
}

/** Words light up one by one as the paragraph scrolls through the viewport. */
function ScrollLitText({ text, className }: { text: string; className: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  if (reduce)
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    )
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}

export function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <SectionHeader id="about-title" index="03" label="About" />
      <ScrollLitText
        text={about.lead}
        className="max-w-[22ch] text-[clamp(2rem,5.2vw,4.75rem)] leading-[1.04] font-semibold tracking-[-0.04em] md:max-w-[24ch]"
      />

      <div className="grid-page mt-16 gap-y-12 md:mt-24">
        <div className="col-span-4 grid gap-6 md:col-span-6 md:col-start-5">
          {about.body.map((para, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <p className="max-w-prose text-lg leading-relaxed text-muted">{para}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="col-span-4 md:col-span-2 md:col-start-11" delay={0.1}>
          <h3 className="label mb-5 text-faint">Interests</h3>
          <ul className="space-y-2">
            {about.interests.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}

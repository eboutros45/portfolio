import { Fragment } from 'react'
import { skills } from '../content/profile'
import { Section } from '../components/Container'
import { Reveal } from '../components/motion'
import { SectionHeader } from '../components/SectionHeader'

/**
 * Skills as a spec sheet: one row per group. Hovering a row sweeps a fill
 * across it and nudges the items. Plain text only: no badges or bars.
 */
export function Skills() {
  return (
    <Section id="skills" labelledBy="skills-title" className="pt-0 md:pt-0">
      <SectionHeader id="skills-title" index="05" label="Technical Skills" />
      <ul className="-mt-12 md:-mt-20">
        {skills.map((group, i) => (
          <li key={group.title}>
            <Reveal delay={i * 0.05}>
              <div className="group relative grid-page items-baseline gap-y-3 overflow-hidden border-b border-line py-6 md:py-9">
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 bg-ink-raised transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                />
                <h3 className="label relative col-span-4 flex gap-4 text-muted md:col-span-3">
                  <span className="text-faint">{String(i + 1).padStart(2, '0')}</span>
                  {group.title}
                </h3>
                <p className="relative col-span-4 text-2xl font-semibold tracking-[-0.03em] transition-transform duration-700 ease-out-expo group-hover:translate-x-3 md:col-span-9 md:text-4xl">
                  {group.items.map((s, k) => (
                    <Fragment key={s}>
                      {k > 0 && (
                        <>
                          {' '}
                          <span aria-hidden className="px-[0.2em] text-faint">
                            /
                          </span>{' '}
                        </>
                      )}
                      <span className="whitespace-nowrap">{s}</span>
                    </Fragment>
                  ))}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}

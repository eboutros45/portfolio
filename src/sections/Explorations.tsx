import { explorations } from '../content/projects'
import { Section } from '../components/Container'
import { Reveal } from '../components/motion'
import { SectionHeader } from '../components/SectionHeader'
import { StatusMark } from '../components/StatusMark'

/**
 * Concepts are drawn as dashed "sketch" cards: not built yet. On hover the
 * outline firms up and the card lifts, as if the idea is taking shape.
 */
export function Explorations() {
  return (
    <Section id="explorations" labelledBy="explorations-title">
      <SectionHeader id="explorations-title" index="02" label="Explorations" aside="Concepts in planning" />
      <div className="grid-page gap-y-10">
        <Reveal className="col-span-4 md:col-span-4">
          <p className="max-w-xs text-lg leading-relaxed text-muted">
            Early ideas I am researching and planning. None of these are finished products.
          </p>
        </Reveal>
        <ul className="col-span-4 grid gap-5 md:col-span-8 md:grid-cols-2">
          {explorations.map((e, i) => (
            <li key={e.name}>
              <Reveal delay={i * 0.1} className="h-full">
                <article className="group relative flex h-full min-h-72 flex-col justify-between gap-10 border border-dashed border-line-strong p-6 transition-[transform,border-color,background-color] duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-solid hover:border-paper hover:bg-ink-raised md:p-8">
                  <div className="label flex items-center justify-between text-faint">
                    <span>Sketch {String(i + 1).padStart(2, '0')}</span>
                    <StatusMark status={e.status} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-semibold tracking-[-0.035em] md:text-4xl">{e.name}</h3>
                    {e.subtitle && <p className="label mt-3 text-muted">{e.subtitle}</p>}
                    <p className="mt-6 max-w-sm leading-relaxed text-muted">{e.description}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

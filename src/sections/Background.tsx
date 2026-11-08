import { education, experience } from '../content/profile'
import { Section } from '../components/Container'
import { Reveal } from '../components/motion'
import { SectionHeader } from '../components/SectionHeader'

/** Experience and Education side by side, each as a quiet record panel. */
export function Background() {
  const job = experience[0]
  return (
    <Section id="experience" labelledBy="experience-title" className="pt-0 md:pt-0">
      <SectionHeader id="experience-title" index="04" label="Experience & Education" />
      <div className="grid gap-px border border-line bg-line md:grid-cols-2">
        <Reveal className="flex flex-col gap-10 bg-ink p-6 md:p-10">
          <div className="label flex justify-between text-faint">
            <span>Experience</span>
            <span>{job.period}</span>
          </div>
          <div>
            <p className="text-3xl font-semibold tracking-[-0.035em] md:text-5xl">{job.role}</p>
            <p className="mt-3 text-lg text-muted">{job.organization}</p>
          </div>
          <ul className="grid gap-3 text-muted">
            {job.points.map((pt) => (
              <li key={pt} className="flex gap-3 leading-relaxed">
                <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                {pt}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-10 bg-ink p-6 md:p-10">
          <div className="label flex justify-between text-faint">
            <span>Education</span>
            <span>{education.period}</span>
          </div>
          <div>
            <p className="text-3xl font-semibold tracking-[-0.035em] md:text-5xl">{education.institution}</p>
            <p className="mt-3 text-lg text-muted">
              {education.degree} · {education.campus}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

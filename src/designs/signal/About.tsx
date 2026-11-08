import { about, education, experience, skills } from '../../content/profile'
import { signalCopy } from './copy'
import { Eyebrow } from './ui'

/** About, experience, education and skills: deliberately quieter than the work. */
export function About({ active }: { active: boolean }) {
  return (
    <section id="about" aria-labelledby="sp-about-title" className="sp-section">
      <div className="sp-wrap">
        <Eyebrow tp="TP4" active={active}>
          About
        </Eyebrow>
        <div className="mt-4 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <h2 id="sp-about-title" className="sp-l2 sp-l2--quiet">
              {signalCopy.aboutTitle}
            </h2>
            <div className="mt-6 space-y-5">
              <p className="sp-l4 sp-tx">{about.lead}</p>
              {about.body.map((p) => (
                <p key={p} className="sp-l4">
                  {p}
                </p>
              ))}
            </div>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Interests">
              {about.interests.map((i) => (
                <li key={i} className="sp-tag">
                  {i}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-6 self-start">
            <div className="sp-sheet">
              <p className="sp-l5 border-b border-[var(--sp-line)] px-5 py-3">Experience</p>
              {experience.map((x) => (
                <div key={x.role} className="sp-sheet__row">
                  <p className="sp-l5">{x.period}</p>
                  <div>
                    <p className="font-medium">
                      {x.role} <span className="text-[var(--sp-mu)]">· {x.organization}</span>
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {x.points.map((pt) => (
                        <li key={pt} className="flex gap-3 text-sm leading-relaxed text-[var(--sp-mu)]">
                          <span aria-hidden className="sp-l5 pt-0.5">—</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              <div className="sp-sheet__row">
                <p className="sp-l5">{education.period}</p>
                <div>
                  <p className="font-medium">{education.degree}</p>
                  <p className="mt-1 text-sm text-[var(--sp-mu)]">
                    {education.institution}, {education.campus}
                  </p>
                </div>
              </div>
            </div>

            <div className="sp-sheet">
              <p className="sp-l5 border-b border-[var(--sp-line)] px-5 py-3">Skills</p>
              {skills.map((g) => (
                <div key={g.title} className="sp-sheet__row">
                  <p className="sp-l5">{g.title}</p>
                  <ul className="flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <li key={s} className="sp-tag">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

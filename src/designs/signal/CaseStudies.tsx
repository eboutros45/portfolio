import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { signalCopy } from './copy'
import { readingList } from './data'
import { Eyebrow } from './ui'

const prefetch = () => void import('./Article')

/**
 * Reading-first index of every case study (project and standalone), with
 * equal weight. Hovering or focusing a row lights its project's board marker.
 */
export function CaseStudies({ active, onHighlight }: { active: boolean; onHighlight: (slug: string | null) => void }) {
  return (
    <section id="case-studies" aria-labelledby="sp-cs-title" className="sp-section">
      <div className="sp-wrap">
        <Eyebrow tp="TP3" active={active}>
          Case studies
        </Eyebrow>
        <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-end">
          <h2 id="sp-cs-title" className="sp-l2">
            {signalCopy.caseStudiesTitle}
          </h2>
          <p className="sp-l4">{signalCopy.caseStudiesIntro}</p>
        </div>

        <div className="sp-index mt-12">
          <div className="sp-index__head sp-l5 hidden lg:grid" aria-hidden>
            <span>No.</span>
            <span>Case study</span>
            <span>Type</span>
            <span>Relates to</span>
            <span>Read</span>
            <span />
          </div>
          <ol>
            {readingList.map((e) => (
              <li
                key={e.href}
                className="sp-index__row"
                onPointerEnter={() => {
                  prefetch()
                  onHighlight(e.related)
                }}
                onPointerLeave={() => onHighlight(null)}
                onFocus={() => onHighlight(e.related)}
                onBlur={() => onHighlight(null)}
              >
                <span className="sp-index__n sp-l5">{e.n}</span>
                <div className="min-w-0">
                  <Link to={e.href} className="sp-index__title sp-stretch">
                    {e.title}
                  </Link>
                  {e.draft && <span className="sp-draft sp-l5 ml-3 align-middle">Draft</span>}
                  <span className="sp-index__sum">{e.summary}</span>
                  <span className="sp-index__meta sp-l5 lg:hidden">
                    <span>{e.type}</span>
                    <span>{e.relatedLabel}</span>
                    <span>{e.readingTime} min read</span>
                  </span>
                </div>
                <span className="hidden lg:block">
                  <span className="sp-tag">{e.type}</span>
                </span>
                <span className="sp-l5 hidden lg:block">{e.relatedLabel}</span>
                <span className="sp-l5 hidden lg:block">{e.readingTime} min</span>
                <ArrowRight aria-hidden className="sp-index__go size-4 self-center" />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

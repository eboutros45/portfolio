import { ArrowLeft } from 'lucide-react'
import { useParams } from 'react-router'
import { getCaseStudy } from '../content/projects'
import { MaskLine, Reveal } from '../components/motion'
import { SectionLink } from '../components/SectionLink'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import NotFound from './NotFound'

/**
 * Standalone case study in the Classic design. Classic's homepage doesn't
 * list these (the Signal design does), but direct links still work.
 */
export default function CaseStudyPage() {
  const { slug } = useParams()
  const study = getCaseStudy(slug)
  useDocumentMeta(study ? `/case-studies/${study.slug}` : `/case-studies/${slug ?? ''}`)
  if (!study) return <NotFound />

  return (
    <main id="main">
      <article className="container-page pt-28 pb-24 md:pt-36 md:pb-36">
        <SectionLink to="work" className="group label inline-flex items-center gap-2 text-muted hover:text-paper">
          <ArrowLeft aria-hidden className="size-3.5" />
          <span className="link-underline">All work</span>
        </SectionLink>
        <p className="label mt-16 text-faint md:mt-24">Case study{study.draft ? ' · Draft' : ''}</p>
        <h1 className="mt-6 text-title font-semibold">
          <MaskLine immediate delay={0.05}>
            {study.title}
          </MaskLine>
        </h1>
        <Reveal className="mt-10 max-w-3xl">
          <p className="text-lead font-medium text-balance">{study.summary}</p>
        </Reveal>
        <div className="mt-16 md:mt-24">
          {study.sections.map((s) => (
            <section key={s.id} aria-labelledby={`c-${s.id}`} className="grid-page gap-y-6 border-t border-line py-12 md:py-16">
              <h2 id={`c-${s.id}`} className="label col-span-4 md:col-span-3">
                {s.title}
              </h2>
              <div className="col-span-4 space-y-6 md:col-span-7 md:col-start-5">
                {s.items.map((t, i) => (
                  <p key={i} className="max-w-prose text-lg leading-relaxed text-muted">
                    {t}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  )
}

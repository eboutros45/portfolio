import './setup'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { m } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { ProjectVisual } from '../../components/ProjectVisual'
import { SectionLink } from '../../components/SectionLink'
import { getCaseStudy, getProject, statusLabel, type ContentSection } from '../../content/projects'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { signalCopy } from './copy'
import { neighbours, readingList, shortCategory, unitOf } from './data'
import { useActiveSection } from './hooks'
import SignalNotFound from './NotFound'

const EASE = [0.16, 1, 0.3, 1] as const

interface Fact {
  label: string
  value: ReactNode
}

/** Shared reading layout for project and case-study pages. */
function ArticleLayout({
  back,
  eyebrow,
  title,
  lede,
  facts,
  sections,
  figureAfter,
  extra,
}: {
  back: { to: string; label: ReactNode }
  eyebrow: ReactNode
  title: string
  lede: string
  facts: Fact[]
  sections: ContentSection[]
  /** Rendered after the first section (the animated figure on project pages). */
  figureAfter?: ReactNode
  /** Extra sections after the Markdown ones (id, title, content). */
  extra?: { id: string; title: string; body: ReactNode }[]
}) {
  const { pathname } = useLocation()
  const toc = [
    ...sections.map((s) => ({ id: `cs-${s.id}`, title: s.title })),
    ...(extra ?? []).map((x) => ({ id: x.id, title: x.title })),
  ]
  const active = useActiveSection(
    toc.map((t) => t.id),
    0.3,
  )
  const { prev, next } = neighbours(pathname)

  return (
    <main id="main">
      <article>
        <header className="sp-wrap pt-28 md:pt-36">
          <SectionLink to={back.to} className="sp-l5 inline-flex min-h-11 items-center gap-2 hover:text-[var(--sp-tx)]">
            <ArrowLeft aria-hidden className="size-3.5" /> {back.label}
          </SectionLink>
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <p className="sp-l5 mt-12 flex flex-wrap items-center gap-x-3 gap-y-1 md:mt-16">{eyebrow}</p>
            <h1 className="sp-l1 mt-4">{title}</h1>
            <p className="sp-lede mt-6">{lede}</p>
          </m.div>
          <m.dl
            className="sp-facts mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="sp-l5">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </m.dl>
        </header>

        <div className="sp-wrap mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="On this page" className="sp-toc sp-l5 hidden lg:block">
            <ul className="sticky top-28 grid gap-1">
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} aria-current={active === t.id ? 'true' : undefined}>
                    <i aria-hidden />
                    <span className="normal-case tracking-normal text-[0.8125rem]">{t.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={`cs-${s.id}`}
                aria-labelledby={`cs-${s.id}-title`}
                className={i ? 'border-t border-[var(--sp-line)] py-12' : 'pb-12'}
              >
                <h2 id={`cs-${s.id}-title`} className="sp-l3">
                  {s.title}
                </h2>
                <div className="sp-prose mt-6" dangerouslySetInnerHTML={{ __html: s.html }} />
                {i === 0 && figureAfter && <div className="mt-12">{figureAfter}</div>}
              </section>
            ))}
            {extra?.map((x) => (
              <section
                key={x.id}
                id={x.id}
                aria-labelledby={`${x.id}-title`}
                className="border-t border-[var(--sp-line)] py-12"
              >
                <h2 id={`${x.id}-title`} className="sp-l3">
                  {x.title}
                </h2>
                <div className="mt-6">{x.body}</div>
              </section>
            ))}
          </div>
        </div>
      </article>

      {prev && next && (
        <nav aria-label="More case studies" className="sp-wrap pt-8 pb-24 md:pb-32">
          <div className="sp-pager">
            <Link to={prev.href}>
              <span className="sp-l5 flex items-center gap-2">
                <ArrowLeft aria-hidden className="size-3.5" /> Previous · {prev.n}
              </span>
              <span className="sp-l3 mt-3 block">{prev.title}</span>
            </Link>
            <Link to={next.href} className="md:text-right">
              <span className="sp-l5 flex items-center gap-2 md:justify-end">
                Next · {next.n} <ArrowRight aria-hidden className="size-3.5" />
              </span>
              <span className="sp-l3 mt-3 block">{next.title}</span>
            </Link>
          </div>
        </nav>
      )}
    </main>
  )
}

function Figure({ visual, unit }: { visual: Parameters<typeof ProjectVisual>[0]['visual']; unit: string }) {
  const [on, setOn] = useState(false)
  return (
    <figure>
      <m.div
        className="sp-figure"
        onViewportEnter={() => setOn(true)}
        onViewportLeave={() => setOn(false)}
        viewport={{ amount: 0.4 }}
      >
        <ProjectVisual visual={visual} active={on} />
      </m.div>
      <figcaption className="sp-l5 mt-3">Fig. {unit} · abstract illustration, not a product interface</figcaption>
    </figure>
  )
}

export function SignalProjectPage() {
  const { slug } = useParams()
  const project = getProject(slug)
  useDocumentMeta(project ? `/projects/${project.slug}` : `/projects/${slug ?? ''}`)
  if (!project) return <SignalNotFound />
  const unit = unitOf(project.slug)
  const entry = readingList.find((e) => e.href === `/projects/${project.slug}`)

  return (
    <ArticleLayout
      back={{
        to: 'work',
        label: (
          <>
            Board / <span className="sp-tx">{unit} {project.name}</span>
          </>
        ),
      }}
      eyebrow={
        <>
          <span className="flex items-center gap-2 sp-sig">
            <span className={`sp-dot ${project.status === 'functional' ? '' : 'sp-dot--off'}`} aria-hidden />
            {statusLabel[project.status]}
          </span>
          {project.statusNote && <span>· {project.statusNote}</span>}
          <span>· {entry?.n}</span>
          <span>· {project.readingTime} min read</span>
        </>
      }
      title={project.name}
      lede={project.summary}
      facts={[
        { label: 'Type', value: shortCategory(project.category) },
        { label: 'Role', value: project.role },
        { label: 'Origin', value: project.origin },
        { label: 'Focus', value: project.focus },
      ]}
      sections={project.sections}
      figureAfter={<Figure visual={project.visual} unit={unit} />}
      extra={[
        {
          id: 'cs-disciplines',
          title: 'Disciplines',
          body: (
            <>
              <ul className="flex flex-wrap gap-2">
                {project.disciplines.map((d) => (
                  <li key={d} className="sp-tag">
                    {d}
                  </li>
                ))}
              </ul>
              <p className="sp-l4 mt-8">{signalCopy.disclosure}</p>
            </>
          ),
        },
      ]}
    />
  )
}

export function SignalCaseStudyPage() {
  const { slug } = useParams()
  const study = getCaseStudy(slug)
  useDocumentMeta(study ? `/case-studies/${study.slug}` : `/case-studies/${slug ?? ''}`)
  if (!study) return <SignalNotFound />
  const entry = readingList.find((e) => e.href === `/case-studies/${study.slug}`)
  const related = study.project ? getProject(study.project) : undefined

  return (
    <ArticleLayout
      back={{
        to: 'case-studies',
        label: (
          <>
            Case studies / <span className="sp-tx">{entry?.n}</span>
          </>
        ),
      }}
      eyebrow={
        <>
          <span className="sp-tx">Case study</span>
          <span>· {entry?.type}</span>
          <span>· {study.readingTime} min read</span>
          {study.draft && <span className="sp-draft">Draft · hidden on the live site</span>}
        </>
      }
      title={study.title}
      lede={study.summary}
      facts={[
        { label: 'Type', value: entry?.type },
        {
          label: 'Relates to',
          value: related ? (
            <Link to={`/projects/${related.slug}`} className="underline decoration-[var(--sp-sig)] underline-offset-4">
              {unitOf(related.slug)} {related.name}
            </Link>
          ) : (
            'Standalone'
          ),
        },
        { label: 'Reading time', value: `${study.readingTime} min` },
      ]}
      sections={study.sections}
    />
  )
}

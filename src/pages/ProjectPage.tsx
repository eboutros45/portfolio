import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useInView } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { getProject, projectIndex, projects } from '../content/projects'
import { Magnetic } from '../components/Magnetic'
import { MaskLine, Reveal, Rule } from '../components/motion'
import { ProjectVisual } from '../components/ProjectVisual'
import { SectionLink } from '../components/SectionLink'
import { StatusMark } from '../components/StatusMark'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import NotFound from './NotFound'

function Block({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  const id = `cs-${title.toLowerCase().replace(/[^a-z]+/g, '-')}`
  return (
    <section aria-labelledby={id} className="grid-page gap-y-6 border-t border-line py-12 md:py-20">
      <h2 id={id} className="label col-span-4 flex gap-4 md:sticky md:top-24 md:col-span-3 md:self-start">
        <span className="text-faint">{n}</span>
        {title}
      </h2>
      <Reveal className="col-span-4 md:col-span-7 md:col-start-5">{children}</Reveal>
    </section>
  )
}

const Paras = ({ items, lead = false }: { items: string[]; lead?: boolean }) => (
  <div className="space-y-6">
    {items.map((p, i) => (
      <p
        key={i}
        className={
          lead && i === 0
            ? 'text-lead font-medium text-balance'
            : 'max-w-prose text-lg leading-relaxed text-muted'
        }
      >
        {p}
      </p>
    ))}
  </div>
)

const List = ({ items }: { items: string[] }) => (
  <ul className="divide-y divide-line border-y border-line">
    {items.map((x) => (
      <li key={x} className="py-4 text-lg md:text-xl">
        {x}
      </li>
    ))}
  </ul>
)

export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProject(slug)
  const visualRef = useRef<HTMLDivElement>(null)
  const visualInView = useInView(visualRef, { amount: 0.5 })
  useDocumentMeta(project ? `/projects/${project.slug}` : `/projects/${slug ?? ''}`)

  if (!project) return <NotFound />

  const i = projects.indexOf(project)
  const next = projects[(i + 1) % projects.length]
  const cs = project.caseStudy

  return (
    <main id="main">
      <article>
        <header className="container-page pt-28 md:pt-36">
          <SectionLink to="work" className="group label inline-flex items-center gap-2 text-muted hover:text-paper">
            <ArrowLeft
              aria-hidden
              className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1"
            />
            <span className="link-underline">All work</span>
          </SectionLink>

          <p className="label mt-16 flex flex-wrap gap-x-4 gap-y-2 text-muted md:mt-24">
            <span className="text-faint">Case Study {projectIndex(project.slug)}</span>
            <span>{project.category}</span>
          </p>
          <h1 className="mt-6 text-headline font-semibold">
            <MaskLine immediate delay={0.05}>
              {project.name}
            </MaskLine>
          </h1>

          <div className="grid-page mt-12 gap-y-10 md:mt-16">
            <Reveal className="col-span-4 md:col-span-6">
              <p className="text-lead font-medium text-balance">{project.summary}</p>
            </Reveal>
            <Reveal delay={0.1} className="col-span-4 md:col-span-4 md:col-start-9">
              <dl className="label grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 text-muted">
                <dt className="text-faint">Category</dt>
                <dd className="text-paper normal-case tracking-normal text-sm">{project.category}</dd>
                <dt className="text-faint">Status</dt>
                <dd>
                  <StatusMark status={project.status} />
                </dd>
                <dt className="text-faint">Disclosure</dt>
                <dd className="text-sm normal-case tracking-normal text-muted">
                  Private project. Source code and implementation details are not public.
                </dd>
              </dl>
            </Reveal>
          </div>
        </header>

        <figure className="container-page mt-16 md:mt-24">
          <Reveal y={40}>
            <div
              ref={visualRef}
              className="aspect-[16/10] border border-line bg-ink-raised p-6 md:aspect-[16/7] md:p-12"
            >
              <ProjectVisual visual={project.visual} active={visualInView} className="size-full" />
            </div>
          </Reveal>
          <figcaption className="label mt-4 text-faint">
            Abstract illustration. Not a product interface.
          </figcaption>
        </figure>

        <div className="container-page mt-20 md:mt-32">
          <Block n="01" title="Overview">
            <Paras items={cs.overview} />
          </Block>
          <Block n="02" title="Problem Domain">
            <Paras items={cs.problem} />
          </Block>
          <Block n="03" title="My Contribution">
            <List items={cs.contribution} />
          </Block>
          <Block n="04" title="Disciplines">
            <ul className="flex flex-wrap gap-x-3 gap-y-3">
              {cs.disciplines.map((d) => (
                <li key={d} className="border border-line-strong px-4 py-2 text-base">
                  {d}
                </li>
              ))}
            </ul>
          </Block>
          <Block n="05" title="Lessons">
            <ol className="space-y-8">
              {cs.lessons.map((l, k) => (
                <li key={k} className="grid grid-cols-[2.5rem_1fr] gap-2">
                  <span className="label pt-1.5 text-faint">{String(k + 1).padStart(2, '0')}</span>
                  <p className="max-w-prose text-lg leading-relaxed text-muted">{l}</p>
                </li>
              ))}
            </ol>
          </Block>
          <Block n="06" title="Status">
            <div className="space-y-5">
              <StatusMark status={project.status} />
              <p className="max-w-prose text-lg leading-relaxed text-muted">
                {project.statusNote
                  ? `${project.statusNote}. The project continues to evolve.`
                  : 'Working software that continues to evolve.'}{' '}
                Specific workflows, features and implementation details are intentionally kept private.
              </p>
            </div>
          </Block>
        </div>
      </article>

      {next && next.slug !== project.slug && (
        <nav aria-label="Next project" className="container-page pt-12 pb-24 md:pb-36">
          <Rule />
          <Link to={`/projects/${next.slug}`} className="group block pt-10 md:pt-16">
            <span className="label flex items-center justify-between text-faint">
              <span>Next project</span>
              <span>{next.category}</span>
            </span>
            <span className="mt-6 flex items-center justify-between gap-6">
              <span className="text-title font-semibold transition-transform duration-700 ease-out-expo group-hover:translate-x-4">
                {next.name}
              </span>
              <Magnetic strength={0.4}>
                <span className="relative grid size-16 place-items-center overflow-hidden rounded-full border border-line-strong transition-colors duration-500 group-hover:border-paper md:size-28">
                  <span
                    aria-hidden
                    className="absolute inset-0 scale-0 rounded-full bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-100"
                  />
                  <ArrowRight
                    aria-hidden
                    strokeWidth={1.25}
                    className="relative size-6 transition-[transform,color] duration-500 ease-out-expo group-hover:translate-x-1 group-hover:text-ink md:size-9"
                  />
                </span>
              </Magnetic>
            </span>
          </Link>
        </nav>
      )}
    </main>
  )
}

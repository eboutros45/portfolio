import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ProjectVisual } from '../../components/ProjectVisual'
import { projects, statusLabel, type Project } from '../../content/projects'
import { signalCopy } from './copy'
import { shortCategory, unitOf } from './data'
import { Eyebrow } from './ui'

const prefetch = () => void import('./Article')

/**
 * One full-width board per project, all with identical anatomy, so no
 * project outranks another. "Powered" only marks the board being looked
 * at: the one nearest the middle of the screen, or the one last focused
 * or tapped. Boards are fully readable unpowered.
 */
function Board({
  project,
  index,
  powered,
  highlight,
  onPower,
  boardRef,
}: {
  project: Project
  index: number
  powered: boolean
  highlight: boolean
  onPower: () => void
  boardRef: (el: HTMLElement | null) => void
}) {
  const unit = unitOf(project.slug)
  return (
    <article
      ref={boardRef}
      className="sp-board"
      data-powered={powered}
      data-highlight={highlight}
      onFocus={onPower}
      onPointerDown={onPower}
      onPointerEnter={prefetch}
      aria-labelledby={`sp-board-${project.slug}`}
    >
      <header className="sp-board__head sp-l5">
        <span className="sp-board__marker">
          <span className={`sp-dot ${project.status === 'functional' ? '' : 'sp-dot--off'}`} aria-hidden />
          <span>
            {unit} · {shortCategory(project.category)}
          </span>
        </span>
        <span className={powered ? 'sp-sig' : undefined}>
          {powered ? 'Powered · ' : ''}
          {statusLabel[project.status]}
          {project.statusNote && <span className="hidden md:inline"> · {project.statusNote}</span>}
        </span>
      </header>

      <div className={`sp-board__body ${index % 2 ? 'sp-board__body--flip' : ''}`}>
        <div className="sp-board__text">
          <div>
            <h3 id={`sp-board-${project.slug}`} className="sp-l3">
              <Link
                to={`/projects/${project.slug}`}
                className="sp-stretch"
                aria-label={`${project.name}, ${project.category}. Open case study`}
              >
                {project.name}
              </Link>
            </h3>
            <p className="sp-l4 mt-3">{project.summary}</p>
            <dl className="sp-pins">
              <dt>Origin</dt>
              <dd>{project.origin}</dd>
              <dt>Role</dt>
              <dd>{project.role}</dd>
              <dt>Focus</dt>
              <dd>{project.focus}</dd>
            </dl>
          </div>
          <span aria-hidden className="sp-btn sp-board__cta">
            Open case study <ArrowRight />
          </span>
        </div>

        <div className="sp-board__figure">
          <ProjectVisual visual={project.visual} active={powered} />
          <span className="sp-board__cap sp-l5">Fig. {unit} · abstract illustration</span>
        </div>
      </div>
    </article>
  )
}

export function Work({ active, highlight }: { active: boolean; highlight: string | null }) {
  const [powered, setPowered] = useState<string | null>(projects[0]?.slug ?? null)
  const boards = useRef(new Map<string, HTMLElement>())

  // Power the board nearest the reading line as the page scrolls.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.5
      let best: string | null = null
      let bestDist = Infinity
      for (const [slug, el] of boards.current) {
        const r = el.getBoundingClientRect()
        if (r.bottom < 0 || r.top > window.innerHeight) continue
        const d = Math.abs((r.top + r.bottom) / 2 - line)
        if (d < bestDist) {
          bestDist = d
          best = slug
        }
      }
      if (best) setPowered(best)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section id="work" aria-labelledby="sp-work-title" className="sp-section">
      <div className="sp-wrap">
        <Eyebrow tp="TP2" active={active}>
          Selected work
        </Eyebrow>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 id="sp-work-title" className="sp-l2">
            {signalCopy.workTitle}
          </h2>
          <p className="sp-l5">
            {String(projects.length).padStart(2, '0')} projects · scroll to power on
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:mt-14 md:gap-8">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Board
                project={p}
                index={i}
                powered={powered === p.slug}
                highlight={highlight === p.slug}
                onPower={() => setPowered(p.slug)}
                boardRef={(el) => {
                  if (el) boards.current.set(p.slug, el)
                  else boards.current.delete(p.slug)
                }}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

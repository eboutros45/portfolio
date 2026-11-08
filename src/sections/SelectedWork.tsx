import { ArrowUpRight } from 'lucide-react'
import {
  m,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useRef, useState, type PointerEvent } from 'react'
import { Link } from 'react-router'
import { projects, type Project } from '../content/projects'
import { EASE } from '../components/motion'
import { ProjectVisual } from '../components/ProjectVisual'
import { SectionHeader } from '../components/SectionHeader'
import { StatusMark } from '../components/StatusMark'
import { useFinePointer } from '../hooks/useFinePointer'
import { prefetchProjectPage } from '../lib/routes'

/**
 * Stacking project cards. Each card pins to the viewport; the next one
 * slides up over it while the cards underneath recede (scale down, dim).
 * On mouse devices a "View" bubble trails the cursor across a card.
 */
function StackCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { amount: 0.45 })
  const [hover, setHover] = useState(false)

  // Recede as later cards cover this one.
  const targetScale = 1 - (total - 1 - index) * 0.06
  const scale = useTransform(progress, [index / total, 1], [1, targetScale])
  const dim = useTransform(progress, [index / total, 1], [0, (total - 1 - index) * 0.35])

  // Cursor bubble position (card-local coordinates)
  const spring = { stiffness: 300, damping: 30, mass: 0.5 }
  const bx = useSpring(0, spring)
  const by = useSpring(0, spring)
  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    if (!hover) {
      bx.jump(e.clientX - r.left)
      by.jump(e.clientY - r.top)
    }
    bx.set(e.clientX - r.left)
    by.set(e.clientY - r.top)
  }

  const n = String(index + 1).padStart(2, '0')
  const showBubble = fine && !reduce

  return (
    <div className="sticky top-0 flex h-svh items-center py-20 md:py-24">
      <m.div
        ref={cardRef}
        className="relative w-full origin-top"
        style={{ scale: reduce ? undefined : scale, top: `${index * 1.25}rem` }}
      >
        <Link
          to={`/projects/${project.slug}`}
          onPointerEnter={() => {
            prefetchProjectPage()
            setHover(true)
          }}
          onPointerLeave={() => setHover(false)}
          onPointerMove={showBubble ? onMove : undefined}
          onFocus={prefetchProjectPage}
          aria-label={`${project.name}, ${project.category}. View case study`}
          className={`group relative flex flex-col overflow-hidden border border-line-strong bg-ink-raised md:h-[min(74svh,760px)] ${
            showBubble ? 'md:cursor-none' : ''
          }`}
        >
          {/* Top bar */}
          <div className="label flex items-center justify-between gap-4 border-b border-line px-5 py-4 text-muted md:px-8">
            <span>
              <span className="text-paper">{n}</span> / {String(total).padStart(2, '0')}
            </span>
            <span className="hidden sm:block">{project.category}</span>
            <StatusMark status={project.status} />
          </div>

          <div className="grid flex-1 gap-8 p-5 md:grid-cols-12 md:gap-10 md:p-8">
            {/* Text */}
            <div className="flex flex-col justify-between gap-8 md:col-span-5">
              <div>
                <h3 className="text-title font-semibold">{project.name}</h3>
                <p className="label mt-4 text-muted sm:hidden">{project.category}</p>
              </div>
              <div>
                <p className="max-w-sm text-lg leading-relaxed text-muted">{project.summary}</p>
                <span className="mt-8 inline-flex items-center gap-3 text-sm font-medium">
                  <span className="relative grid size-11 place-items-center overflow-hidden rounded-full border border-line-strong">
                    <span
                      aria-hidden
                      className="absolute inset-0 scale-0 rounded-full bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-100"
                    />
                    <ArrowUpRight
                      aria-hidden
                      className="relative size-4 transition-[transform,color] duration-500 ease-out-expo group-hover:rotate-45 group-hover:text-ink"
                    />
                  </span>
                  <span className="link-underline">View case study</span>
                </span>
              </div>
            </div>

            {/* Visual: animates while the card is in view */}
            <div className="relative aspect-[16/10] overflow-hidden border border-line bg-ink md:col-span-7 md:aspect-auto">
              <div className="absolute inset-0 p-6 pb-10 transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04] md:p-10 md:pb-12">
                <ProjectVisual visual={project.visual} active={inView || hover} className="size-full" />
              </div>
              <span className="label absolute bottom-3 left-4 text-faint">Abstract illustration</span>
            </div>
          </div>

          {/* Cursor-following "View" bubble */}
          {showBubble && (
            <m.span
              aria-hidden
              className="pointer-events-none absolute top-0 left-0 z-10 hidden md:block"
              style={{ x: bx, y: by }}
            >
              <m.span
                className="label grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink"
                initial={false}
                animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                View
              </m.span>
            </m.span>
          )}

          {/* Dims the card as the next one slides over it */}
          {!reduce && index < total - 1 && (
            <m.span aria-hidden className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: dim }} />
          )}
        </Link>
      </m.div>
    </div>
  )
}

export function SelectedWork() {
  const stackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] })

  return (
    <section id="work" aria-labelledby="work-title" className="container-page pt-24 md:pt-36">
      <SectionHeader
        id="work-title"
        index="01"
        label="Selected Work"
        aside={`${String(projects.length).padStart(2, '0')} Projects`}
      />
      <div ref={stackRef} className="relative -mt-16 md:-mt-28">
        {projects.map((p, i) => (
          <StackCard key={p.slug} project={p} index={i} total={projects.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  )
}

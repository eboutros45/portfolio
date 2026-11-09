import { m, useReducedMotion } from 'motion/react'
import { useMemo } from 'react'
import type { VisualKey } from '../content/projects'

/**
 * Abstract, generative SVG compositions that stand in for product
 * screenshots. They express each project's *idea*, never its interface:
 *
 * - FawarOS: irregular, scattered blocks. When `active`, every block
 *   settles into an orderly grid ("streamlined workflows").
 * - IDLab: a waveform where one segment repeats identically (the
 *   repetitive task). When `active`, the bars pulse in a travelling ripple.
 * - Backroom: connected layers moving from a local core toward a distributed
 *   web experience. When `active`, the connections come online in sequence.
 *
 * Deterministic (seeded) so every render and every visitor sees the same art.
 * Animation is disabled for visitors who prefer reduced motion.
 */

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const W = 800
const H = 500
const EASE = [0.16, 1, 0.3, 1] as const

function Fawaros({ active }: { active: boolean }) {
  const cells = useMemo(() => {
    const r = rng(7)
    const rows = 9
    const cols = 16
    const cw = W / cols
    const rh = H / rows
    const out = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const t = col / (cols - 1) // 0 → disorder, 1 → order
        if (r() < 0.32 - t * 0.12) continue
        const jitter = (1 - t) ** 2
        // Ordered geometry (the rect's real attributes)
        const ow = cw * 0.62
        const oh = rh * 0.34
        const ox = col * cw + (cw - ow) / 2
        const oy = row * rh + (rh - oh) / 2
        // Scattered geometry, expressed as a transform from the ordered one
        const sw = cw * (0.62 + (r() - 0.5) * 0.9 * jitter)
        const sh = rh * (0.34 + (r() - 0.5) * 0.5 * jitter)
        const sx = col * cw + (cw - sw) / 2 + (r() - 0.5) * cw * 1.2 * jitter
        const sy = row * rh + (rh - sh) / 2 + (r() - 0.5) * rh * 1.1 * jitter
        out.push({
          ox,
          oy,
          ow,
          oh,
          dx: sx + sw / 2 - (ox + ow / 2),
          dy: sy + sh / 2 - (oy + oh / 2),
          kx: sw / ow,
          ky: sh / oh,
          o: 0.22 + t * 0.6,
          hi: row === 4 && col > 9,
          col,
          row,
        })
      }
    }
    return out
  }, [])

  return (
    <>
      {cells.map((c, i) => (
        <m.rect
          key={i}
          x={c.ox}
          y={c.oy}
          width={c.ow}
          height={c.oh}
          fill="var(--color-paper)"
          initial={false}
          animate={
            active
              ? { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: c.hi || c.row === 4 ? 1 : 0.7 }
              : { x: c.dx, y: c.dy, scaleX: c.kx, scaleY: c.ky, opacity: c.hi ? 1 : c.o }
          }
          transition={{
            duration: active ? 1.1 : 0.8,
            ease: EASE,
            delay: active ? (15 - c.col) * 0.025 + c.row * 0.01 : 0,
          }}
        />
      ))}
    </>
  )
}

function Idlab({ active }: { active: boolean }) {
  const bars = useMemo(() => {
    const r = rng(23)
    const n = 96
    const segStart = 30
    const segLen = 14
    const motif = Array.from({ length: segLen }, () => 0.15 + r() * 0.85)
    return Array.from({ length: n }, (_, i) => {
      const local = (i - segStart) % (segLen + 2)
      const inRepeat = i >= segStart && local < segLen && i < segStart + 3 * (segLen + 2)
      const amp = inRepeat ? motif[local] : 0.08 + r() ** 1.6 * 0.9
      return { i, amp, inRepeat }
    })
  }, [])
  const bw = W / bars.length

  return (
    <>
      <line x1={0} x2={W} y1={H / 2} y2={H / 2} stroke="var(--color-line-strong)" strokeWidth={1} />
      {bars.map((b) => {
        const h = b.amp * H * 0.72
        return (
          <m.rect
            key={b.i}
            x={b.i * bw + bw * 0.22}
            y={H / 2 - h / 2}
            width={bw * 0.56}
            height={h}
            fill="var(--color-paper)"
            initial={false}
            animate={
              active
                ? { scaleY: [1, 0.35, 1.08, 1], opacity: b.inRepeat ? 1 : 0.4 }
                : { scaleY: 1, opacity: b.inRepeat ? 0.95 : 0.24 }
            }
            transition={
              active
                ? {
                    scaleY: { duration: 1.4, ease: 'easeInOut', repeat: Infinity, delay: b.i * 0.018 },
                    opacity: { duration: 0.6 },
                  }
                : { duration: 0.6, ease: EASE }
            }
          />
        )
      })}
    </>
  )
}

function Backroom({ active }: { active: boolean }) {
  const nodes = [
    { x: 120, y: 250, r: 34 },
    { x: 310, y: 125, r: 24 },
    { x: 310, y: 375, r: 24 },
    { x: 510, y: 175, r: 28 },
    { x: 510, y: 325, r: 28 },
    { x: 690, y: 250, r: 36 },
  ]
  const edges = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [1, 4]]
  return (
    <>
      {edges.map(([a, b], index) => (
        <m.line
          key={`${a}-${b}`}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="var(--color-paper)"
          strokeWidth={2}
          initial={false}
          animate={{ pathLength: active ? 1 : 0.18, opacity: active ? 0.65 : 0.18 }}
          transition={{ duration: 0.8, ease: EASE, delay: active ? index * 0.08 : 0 }}
        />
      ))}
      {nodes.map((node, index) => (
        <m.g key={`${node.x}-${node.y}`} initial={false} animate={{ opacity: active ? 1 : 0.4 }} transition={{ duration: 0.5, delay: active ? index * 0.09 : 0 }}>
          <circle cx={node.x} cy={node.y} r={node.r} fill="var(--color-line-strong)" />
          <circle cx={node.x} cy={node.y} r={node.r * 0.42} fill="var(--color-paper)" />
        </m.g>
      ))}
    </>
  )
}

export function ProjectVisual({
  visual,
  active = false,
  className = '',
}: {
  visual: VisualKey
  active?: boolean
  className?: string
}) {
  const reduce = useReducedMotion()
  const on = active && !reduce
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className={`overflow-visible ${className}`}
      role="img"
      aria-label="Abstract illustration (not a product interface)"
    >
      {visual === 'fawaros' ? <Fawaros active={on} /> : visual === 'idlab' ? <Idlab active={on} /> : <Backroom active={on} />}
    </svg>
  )
}

import {
  m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { Fragment, useRef } from 'react'

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

/**
 * Endless horizontal band of words. It drifts on its own, speeds up with
 * scroll velocity, and flips direction when you scroll back up.
 * Static (no movement) for reduced-motion visitors.
 */
export function Marquee({ items, speed = 2.2 }: { items: readonly string[]; speed?: number }) {
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const direction = useRef(-1)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const b = boost.get()
    if (b < 0) direction.current = 1
    else if (b > 0) direction.current = -1
    const move = direction.current * speed * (delta / 1000) * (1 + Math.abs(b))
    baseX.set(baseX.get() + move)
  })

  // Two identical halves so wrapping at -50% is seamless.
  const half = (
    <span className="flex shrink-0 items-center">
      {[...items, ...items].map((item, i) => (
        <Fragment key={i}>
          <span className="px-[0.35em]">{item}</span>
          <span aria-hidden className="px-[0.35em] text-accent">
            ✳
          </span>
        </Fragment>
      ))}
    </span>
  )

  return (
    <div className="overflow-hidden border-y border-line py-5 md:py-7" aria-label={items.join(', ')} role="img">
      <m.div
        aria-hidden
        className="flex w-max text-[clamp(2.25rem,6vw,5.5rem)] leading-none font-semibold tracking-[-0.04em] whitespace-nowrap uppercase"
        style={{ x: reduce ? undefined : x }}
      >
        {half}
        {half}
      </m.div>
    </div>
  )
}

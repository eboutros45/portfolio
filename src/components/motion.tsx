import { m, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Motion primitives. All animation in the site goes through these so the
 * feel stays consistent. `<MotionConfig reducedMotion="user">` in App.tsx
 * makes transform animations jump to their end state for users who prefer
 * reduced motion; only gentle opacity fades remain.
 */

export const EASE = [0.16, 1, 0.3, 1] as const

const viewport = { once: true, margin: '0px 0px -12% 0px' } as const

/** Fade + rise when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  ...rest
}: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<'div'>) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </m.div>
  )
}

/**
 * A single line of a large heading that slides up from behind a mask.
 * `immediate` animates on mount (hero) instead of on scroll.
 */
export function MaskLine({
  children,
  delay = 0,
  immediate = false,
  className = '',
}: {
  children: ReactNode
  delay?: number
  immediate?: boolean
  className?: string
}) {
  const target = { y: '0%' }
  return (
    <span className="mask-line">
      <m.span
        className={`block ${className}`}
        initial={{ y: '110%' }}
        {...(immediate ? { animate: target } : { whileInView: target, viewport })}
        transition={{ duration: 1.15, ease: EASE, delay }}
      >
        {children}
      </m.span>
    </span>
  )
}

/**
 * A word whose letters rise one by one from behind a mask, with a slight
 * tilt that settles. Decorative: the parent heading carries the aria-label.
 */
export function SplitLetters({
  text,
  delay = 0,
  stagger = 0.045,
  immediate = false,
  accentLast = false,
  wave = false,
}: {
  text: string
  delay?: number
  stagger?: number
  immediate?: boolean
  /** Colour the final character (e.g. the closing period) with the theme accent */
  accentLast?: boolean
  /** Letters ripple upward when an ancestor with `group/wave` is hovered */
  wave?: boolean
}) {
  const target = { y: '0%', rotate: 0 }
  const chars = [...text]
  return (
    <span className="mask-line" aria-hidden>
      {chars.map((ch, i) => (
        <m.span
          key={i}
          className={`inline-block origin-bottom-left will-change-transform ${
            accentLast && i === chars.length - 1 ? 'text-accent' : ''
          }`}
          initial={{ y: '115%', rotate: 7 }}
          {...(immediate ? { animate: target } : { whileInView: target, viewport })}
          transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
        >
          {wave ? (
            <span
              className="inline-block transition-transform duration-500 ease-out-expo group-hover/wave:-translate-y-[0.12em]"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ) : ch === ' ' ? (
            ' '
          ) : (
            ch
          )}
        </m.span>
      ))}
    </span>
  )
}

/** Horizontal hairline that draws itself from left to right. */
export function Rule({ delay = 0, className = '' }: { delay?: number; className?: string }) {
  return (
    <m.div
      aria-hidden
      className={`h-px origin-left bg-line-strong ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={viewport}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  )
}

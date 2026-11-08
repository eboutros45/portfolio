import type { ReactNode } from 'react'

/** Section eyebrow (L5) with its node on the signal rail: "TP2 · Selected work". */
export function Eyebrow({ tp, children, active = false }: { tp: string; children: ReactNode; active?: boolean }) {
  return (
    <p className="sp-eyebrow sp-l5" data-active={active}>
      <b>{tp}</b>
      <span aria-hidden>·</span>
      <span>{children}</span>
    </p>
  )
}

/** Dev-only marker for content that is still missing. Renders nothing in production. */
export function DevPlaceholder({ children }: { children: ReactNode }) {
  if (!import.meta.env.DEV) return null
  return <span className="sp-placeholder sp-l5">{children}</span>
}

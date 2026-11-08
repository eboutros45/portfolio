import type { ReactNode } from 'react'

/** Standard homepage section: consistent vertical rhythm and an accessible name. */
export function Section({
  id,
  labelledBy,
  children,
  className = '',
}: {
  id: string
  labelledBy: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`container-page py-24 md:py-36 ${className}`}>
      {children}
    </section>
  )
}

import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

/** External / mailto link with a nudging arrow. */
export function ArrowLink({
  href,
  children,
  className = '',
  external = false,
}: {
  href: string
  children: ReactNode
  className?: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-2 ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className="link-underline">{children}</span>
      <ArrowUpRight
        aria-hidden
        className="size-[0.9em] shrink-0 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        strokeWidth={1.5}
      />
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  )
}

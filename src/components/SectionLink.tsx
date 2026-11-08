import type { MouseEvent, ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { scrollToId } from '../lib/scroll'

/**
 * Link to a homepage section that works from any page:
 * - on the homepage it smooth-scrolls (and updates the hash) without a navigation;
 * - elsewhere it navigates to `/#id`, and App scrolls once the page has mounted.
 */
export function SectionLink({
  to,
  children,
  className,
  ...rest
}: { to: string; children: ReactNode; className?: string } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
>) {
  const location = useLocation()
  const navigate = useNavigate()

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (location.pathname === '/') {
      if (scrollToId(to)) navigate({ hash: to }, { replace: true, preventScrollReset: true })
    } else {
      navigate({ pathname: '/', hash: to })
    }
  }

  return (
    <Link to={{ pathname: '/', hash: to }} onClick={onClick} className={className} {...rest}>
      {children}
    </Link>
  )
}

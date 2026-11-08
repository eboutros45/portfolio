import './setup'
import { ArrowLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

export default function SignalNotFound() {
  const { pathname } = useLocation()
  useDocumentMeta(pathname, { noindex: true })
  return (
    <main id="main" className="sp-wrap flex min-h-svh flex-col justify-center pt-28 pb-24">
      <p className="sp-l5 flex items-center gap-2">
        <span className="sp-dot sp-dot--off" aria-hidden /> Error 404 · no signal
      </p>
      <h1 className="sp-l1 mt-5">Nothing on this trace.</h1>
      <p className="sp-lede mt-6">This page doesn&rsquo;t exist, or it has moved.</p>
      <Link to="/" className="sp-btn sp-btn--primary mt-9 self-start">
        <ArrowLeft aria-hidden /> Back to the homepage
      </Link>
    </main>
  )
}

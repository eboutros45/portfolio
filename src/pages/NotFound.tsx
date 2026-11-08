import { ArrowLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { MaskLine } from '../components/motion'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function NotFound() {
  const { pathname } = useLocation()
  useDocumentMeta(pathname, { noindex: true })
  return (
    <main id="main" className="container-page flex min-h-svh flex-col justify-end pt-32 pb-24">
      <p className="label mb-8 text-faint">Error 404</p>
      <h1 className="text-headline font-semibold uppercase">
        <MaskLine immediate>Not</MaskLine>
        <MaskLine immediate delay={0.08}>
          Found.
        </MaskLine>
      </h1>
      <p className="mt-10 max-w-md text-lg text-muted">This page doesn&rsquo;t exist, or it has moved.</p>
      <Link to="/" className="group label mt-10 inline-flex items-center gap-2 self-start">
        <ArrowLeft
          aria-hidden
          className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1"
        />
        <span className="link-underline">Back to homepage</span>
      </Link>
    </main>
  )
}

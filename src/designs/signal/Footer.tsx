import './setup'
import { ArrowUp } from 'lucide-react'
import { LocalTime } from '../../components/LocalTime'
import { site } from '../../content/site'
import { scrollToTop } from '../../lib/scroll'

export default function SignalFooter() {
  return (
    <footer className="border-t border-[var(--sp-line)]">
      <div className="sp-wrap sp-l5 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-8">
        <p>
          © {new Date().getFullYear()} <span className="sp-tx">{site.name}</span>
        </p>
        <p>
          {site.location} · <LocalTime />
        </p>
        <button type="button" onClick={() => scrollToTop()} className="sp-kbd sp-l5">
          Back to top <ArrowUp aria-hidden className="size-3.5" />
        </button>
      </div>
    </footer>
  )
}

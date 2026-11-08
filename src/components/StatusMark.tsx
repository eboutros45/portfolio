import { statusLabel, type ProjectStatus } from '../content/projects'

/**
 * Project status without colour: a filled dot means working software,
 * a hollow dot means concept / planning. The label is always written out,
 * so the meaning never depends on the symbol alone.
 */
export function StatusMark({ status, note }: { status: ProjectStatus; note?: string }) {
  const filled = status === 'functional'
  return (
    <span className="label inline-flex items-center gap-2 text-muted">
      <span
        aria-hidden
        className={`inline-block size-1.5 rounded-full ${
          filled ? 'bg-accent' : status === 'in-development' ? 'bg-faint' : 'border border-faint'
        }`}
      />
      <span className={filled ? 'text-paper' : undefined}>{statusLabel[status]}</span>
      {note && <span className="normal-case tracking-normal text-faint">· {note}</span>}
    </span>
  )
}

import { ArrowRight } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { scrollToId } from '../../lib/scroll'
import { readingList, SECTIONS } from './data'

interface Item {
  id: string
  group: string
  label: string
  hint: string
  run: () => void
}

/**
 * ⌘K / Ctrl+K jump menu: sections, projects and case studies.
 * Combobox pattern: focus stays in the input, arrows move the selection,
 * Enter opens it, Esc closes. Focus returns to where it was.
 */
export function CommandMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const listId = useId()

  const items = useMemo<Item[]>(() => {
    const goSection = (id: string) => () => {
      if (pathname === '/') {
        if (scrollToId(id)) navigate({ hash: id }, { replace: true, preventScrollReset: true })
      } else navigate({ pathname: '/', hash: id })
    }
    return [
      ...SECTIONS.map((s) => ({
        id: `s-${s.id}`,
        group: 'Sections',
        label: s.label,
        hint: s.tp,
        run: goSection(s.id),
      })),
      ...readingList.map((e) => ({
        id: `r-${e.kind}-${e.slug}`,
        group: e.kind === 'project' ? 'Projects' : 'Case studies',
        label: e.title,
        hint: e.n,
        run: () => navigate(e.href),
      })),
    ]
  }, [navigate, pathname])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? items.filter((i) => `${i.label} ${i.group} ${i.hint}`.toLowerCase().includes(q)) : items
  }, [items, query])

  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement as HTMLElement | null
    setQuery('')
    setIndex(0)
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(id)
      document.body.style.overflow = prevOverflow
      returnFocus.current?.focus?.()
    }
  }, [open])

  useEffect(() => setIndex(0), [query])

  if (!open) return null

  const run = (item: Item | undefined) => {
    if (!item) return
    onClose()
    // Let the menu unmount (and focus return) before scrolling/navigating.
    requestAnimationFrame(item.run)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(filtered[index])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'Tab') {
      // Keep focus inside the dialog (the input is its only stop).
      e.preventDefault()
    }
  }

  let lastGroup = ''
  return (
    <div className="sp-cmd-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Jump to" className="sp-cmd" onKeyDown={onKeyDown}>
        <div className="flex items-center border-b border-[var(--sp-line)]">
          <input
            ref={inputRef}
            className="sp-cmd__input border-0"
            placeholder="Jump to a section, project or case study…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={filtered[index] ? `${listId}-${filtered[index].id}` : undefined}
            aria-autocomplete="list"
          />
          <button type="button" onClick={onClose} className="sp-kbd sp-l5 mr-3 shrink-0">
            Esc
          </button>
        </div>
        <ul id={listId} role="listbox" aria-label="Results" className="sp-cmd__list">
          {filtered.length === 0 && <li className="sp-l5 px-3 py-6">No matches</li>}
          {filtered.map((item, i) => {
            const header = item.group !== lastGroup
            lastGroup = item.group
            return (
              <li key={item.id} role="presentation">
                {header && (
                  <p className="sp-cmd__group sp-l5" aria-hidden>
                    {item.group}
                  </p>
                )}
                <div
                  id={`${listId}-${item.id}`}
                  role="option"
                  aria-selected={i === index}
                  className="sp-cmd__item cursor-pointer"
                  onMouseMove={() => setIndex(i)}
                  onClick={() => run(item)}
                >
                  <span>{item.label}</span>
                  <span className="sp-l5 sp-cmd__go flex items-center gap-2">
                    {item.hint}
                    <ArrowRight aria-hidden className="size-3.5" />
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

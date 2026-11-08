import { Rule } from './motion'

/** "(02)  Selected Work ———————————— 02 Projects" */
export function SectionHeader({
  index,
  label,
  aside,
  id,
}: {
  index: string
  label: string
  aside?: string
  /** id of the heading, for aria-labelledby on the section */
  id: string
}) {
  return (
    <div className="mb-12 md:mb-20">
      <div className="label flex items-baseline justify-between gap-6 pb-4 text-muted">
        <h2 id={id} className="flex items-baseline gap-4 text-paper">
          <span className="text-faint" aria-hidden>
            ({index})
          </span>
          {label}
        </h2>
        {aside && <span className="text-faint">{aside}</span>}
      </div>
      <Rule />
    </div>
  )
}

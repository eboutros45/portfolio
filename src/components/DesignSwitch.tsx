import { designs } from '../content/designs'
import { designSwitchEnabled } from '../lib/design'
import { useDesign } from './DesignProvider'

/**
 * Preview-only switch between the Classic and Signal Path designs.
 * Shown in `npm run dev`, or after a visit with `?design=…`. Visitors never
 * see it. To ship a design, set ACTIVE_DESIGN in src/content/designs.ts.
 */
export function DesignSwitch() {
  const { design, setDesign } = useDesign()
  if (!designSwitchEnabled()) return null
  return (
    <div
      role="group"
      aria-label="Preview design"
      className="fixed right-4 bottom-4 z-[90] flex items-center gap-1 rounded-full border border-black/15 bg-white/90 p-1 font-mono text-[11px] text-black shadow-lg backdrop-blur"
    >
      <span className="px-2 opacity-60">Design</span>
      {designs.map((d) => (
        <button
          key={d.id}
          type="button"
          aria-pressed={design === d.id}
          onClick={() => setDesign(d.id)}
          className={`rounded-full px-3 py-1.5 transition-colors ${
            design === d.id ? 'bg-black text-white' : 'hover:bg-black/10'
          }`}
        >
          {d.name}
        </button>
      ))}
    </div>
  )
}

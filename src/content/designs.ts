/**
 * Site designs. Both run from the same content and routes.
 *
 * - `ACTIVE_DESIGN` is what visitors see. Change this one line to switch.
 * - Design previews and the floating switch are disabled for the live direction.
 */
export const designs = [
  { id: 'classic', name: 'Classic', meta: '#e8e5de' },
  { id: 'signal', name: 'Signal Path', meta: '#0a0e0d' },
] as const

export type DesignId = (typeof designs)[number]['id']

/** The design visitors see. */
export const ACTIVE_DESIGN: DesignId = 'signal'

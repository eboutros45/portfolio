/**
 * Site designs. Both run from the same content and routes.
 *
 * - `ACTIVE_DESIGN` is what visitors see. Change this one line to switch.
 * - Preview the other design on any build with `?design=signal` or
 *   `?design=classic` (remembered for the browser tab). In `npm run dev` a
 *   small switch also appears in the bottom-right corner.
 */
export const designs = [
  { id: 'classic', name: 'Classic', meta: '#e8e5de' },
  { id: 'signal', name: 'Signal Path', meta: '#0a0e0d' },
] as const

export type DesignId = (typeof designs)[number]['id']

/** The design visitors see. */
export const ACTIVE_DESIGN: DesignId = 'classic'

/**
 * Colour schemes. The live site uses `ACTIVE_THEME`; change that one line
 * to switch. Palettes live in `src/styles/index.css` (Paper is the default
 * token set; Stone and Sage override it under `[data-theme='…']`).
 *
 * Token naming: `ink` is always the BACKGROUND and `paper` always the
 * FOREGROUND, so components never need to change between schemes.
 */

export const themes = [
  { id: 'paper', name: 'Paper', swatch: ['#f3f2ee', '#141413'], meta: '#f3f2ee' },
  { id: 'stone', name: 'Stone + Signal', swatch: ['#e8e5de', '#e8461e'], meta: '#e8e5de' },
  { id: 'sage', name: 'Sage', swatch: ['#dde1d6', '#1a1f18'], meta: '#dde1d6' },
] as const

export type ThemeId = (typeof themes)[number]['id']

/** The scheme visitors see. */
export const ACTIVE_THEME: ThemeId = 'stone'

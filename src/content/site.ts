/**
 * Site-wide identity and contact details.
 *
 * This file is plain data (no browser APIs) because it is also imported by
 * the build-time SEO plugin in `plugins/seo.ts`.
 */

export const site = {
  name: 'Elie Boutros',
  monogram: 'EB.',
  url: 'https://elieboutros.dev',
  role: 'Computer Engineering Student & Software Developer',
  statement: 'I build practical software that connects engineering with real-world problems.',
  description:
    'Elie Boutros is a Computer Engineering student at the Lebanese American University and a software developer based in Lebanon, building practical software products.',
  location: 'Lebanon',
  /**
   * Short availability line shown in the Signal hero, e.g. 'Open to internships'.
   * `null` hides it (dev shows a dashed placeholder).
   */
  availability: null as string | null,
  timeZone: 'Asia/Beirut',
  ogImage: '/og-image.png',
} as const

/**
 * CONTACT PLACEHOLDERS
 * --------------------
 * Replace `null` with your real details. Links that are still `null` are
 * hidden in the production build. In `npm run dev` they appear as
 * dashed "placeholder" markers so you can see what is missing, and
 * `npm run build` prints a warning listing them.
 */
export const contact: {
  /** e.g. 'name@example.com' */
  email: string | null
  /** Full URL, e.g. 'https://www.linkedin.com/in/your-handle' */
  linkedin: string | null
  /** Full URL, e.g. 'https://github.com/your-handle' */
  github: string | null
} = {
  email: 'eliebo2006@gmail.com',
  linkedin: 'https://www.linkedin.com/in/elie-boutros-4b8525378/',
  github: 'https://github.com/eboutros45',
}

export type ContactKey = keyof typeof contact

export interface ContactLink {
  key: ContactKey
  label: string
  /** What is shown on the page, e.g. the address or "linkedin.com/in/…" */
  display: string | null
  href: string | null
}

const prettyUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

export function getContactLinks(): ContactLink[] {
  return [
    {
      key: 'email',
      label: 'Email',
      display: contact.email,
      href: contact.email ? `mailto:${contact.email}` : null,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      display: contact.linkedin ? prettyUrl(contact.linkedin) : null,
      href: contact.linkedin,
    },
    {
      key: 'github',
      label: 'GitHub',
      display: contact.github ? prettyUrl(contact.github) : null,
      href: contact.github,
    },
  ]
}

import { caseStudies, projects, statusLabel, type CaseStudyType } from '../../content/projects'

/** Homepage sections, shown as the circuit's test points in the nav. */
export const SECTIONS = [
  { id: 'intro', tp: 'TP1', label: 'Intro' },
  { id: 'work', tp: 'TP2', label: 'Work' },
  { id: 'case-studies', tp: 'TP3', label: 'Case studies' },
  { id: 'about', tp: 'TP4', label: 'About' },
  { id: 'contact', tp: 'TP5', label: 'Contact' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

/** "U1", "U2"…: each project is a component on the board. */
export const unitOf = (slug: string) => `U${projects.findIndex((p) => p.slug === slug) + 1}`

/** First part of a category, e.g. "Business Software / Product Engineering" → "Business Software". */
export const shortCategory = (category: string) => category.split('/')[0].trim()

const typeLabel: Record<CaseStudyType, string> = {
  product: 'Product',
  automation: 'Automation',
  concept: 'Concept',
  other: 'Notes',
}

export interface ReadingEntry {
  /** CS-01, CS-02… */
  n: string
  kind: 'project' | 'study'
  slug: string
  href: string
  title: string
  summary: string
  type: string
  /** Related project slug (a project's own case study relates to itself). */
  related: string | null
  relatedLabel: string
  readingTime: number
  draft: boolean
}

/**
 * Every case study, with equal weight: project case studies first (in
 * project order), then standalone ones (in their own order).
 */
export const readingList: ReadingEntry[] = [
  ...projects.map((p) => ({
    kind: 'project' as const,
    slug: p.slug,
    href: `/projects/${p.slug}`,
    title: p.name,
    summary: p.summary,
    type: shortCategory(p.category),
    related: p.slug,
    relatedLabel: `${unitOf(p.slug)} ${p.name}`,
    readingTime: p.readingTime,
    draft: p.draft,
  })),
  ...caseStudies.map((c) => {
    const rel = c.project ? projects.find((p) => p.slug === c.project) : undefined
    return {
      kind: 'study' as const,
      slug: c.slug,
      href: `/case-studies/${c.slug}`,
      title: c.title,
      summary: c.summary,
      type: typeLabel[c.type],
      related: rel?.slug ?? null,
      relatedLabel: rel ? `${unitOf(rel.slug)} ${rel.name}` : 'Standalone',
      readingTime: c.readingTime,
      draft: c.draft,
    }
  }),
].map((e, i) => ({ ...e, n: `CS-${String(i + 1).padStart(2, '0')}` }))

export function neighbours(href: string) {
  const i = readingList.findIndex((e) => e.href === href)
  if (i < 0 || readingList.length < 2) return { prev: null, next: null }
  return {
    prev: readingList[(i - 1 + readingList.length) % readingList.length],
    next: readingList[(i + 1) % readingList.length],
  }
}

export { statusLabel }

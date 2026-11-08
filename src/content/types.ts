/**
 * Shapes of the Markdown content collections (content/projects, content/case-studies).
 * Shared by the build-time loader (plugins/content.ts) and the app, so this
 * file must stay free of Node and browser APIs.
 */

export const PROJECT_STATUSES = ['functional', 'in-development', 'concept'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const VISUAL_KEYS = ['fawaros', 'idlab'] as const
export type VisualKey = (typeof VISUAL_KEYS)[number]

export const CASE_STUDY_TYPES = ['product', 'automation', 'concept', 'other'] as const
export type CaseStudyType = (typeof CASE_STUDY_TYPES)[number]

/** One `## Heading` block of a Markdown body. */
export interface ContentSection {
  /** URL-safe id, used for anchors and the table of contents. */
  id: string
  title: string
  /** Rendered HTML (raw HTML in the source is stripped). */
  html: string
  /** Plain text of each paragraph or list item, in order. */
  items: string[]
}

export interface ProjectEntry {
  slug: string
  name: string
  order: number
  category: string
  status: ProjectStatus
  statusNote?: string
  summary: string
  origin: string
  role: string
  focus: string
  visual: VisualKey
  disciplines: string[]
  draft: boolean
  readingTime: number
  sections: ContentSection[]
}

export interface CaseStudyEntry {
  slug: string
  title: string
  order: number
  type: CaseStudyType
  /** Slug of a related project, if any. */
  project: string | null
  summary: string
  draft: boolean
  readingTime: number
  sections: ContentSection[]
}

export interface ContentData {
  projects: ProjectEntry[]
  caseStudies: CaseStudyEntry[]
}

/**
 * Portfolio projects and case studies, read from Markdown in `content/`.
 *
 * To add or edit one, change a file in `content/projects/` or
 * `content/case-studies/`. See `content/README.md` for the fields and the
 * CONFIDENTIALITY RULES that apply to everything written there.
 *
 * This module adapts the Markdown data to the shapes the pages use, and
 * keeps the exports the Classic design has always imported.
 */
import content from 'virtual:content'
import type { CaseStudyEntry, ProjectEntry, ProjectStatus } from './types'

export type { CaseStudyEntry, CaseStudyType, ContentSection, ProjectStatus, VisualKey } from './types'

export const statusLabel: Record<ProjectStatus, string> = {
  functional: 'Functional',
  'in-development': 'In Development',
  concept: 'Concept / Planning',
}

export interface Project extends ProjectEntry {
  /** Case-study text grouped the way the Classic project page lays it out. */
  caseStudy: {
    overview: string[]
    problem: string[]
    contribution: string[]
    disciplines: string[]
    lessons: string[]
  }
}

const itemsOf = (p: ProjectEntry, title: string) => p.sections.find((s) => s.title === title)?.items ?? []

const toProject = (p: ProjectEntry): Project => ({
  ...p,
  caseStudy: {
    overview: itemsOf(p, 'Overview'),
    problem: itemsOf(p, 'The problem'),
    contribution: itemsOf(p, 'My role'),
    disciplines: p.disciplines,
    lessons: itemsOf(p, 'What I learned'),
  },
})

export const projects: Project[] = content.projects.map(toProject)

export const caseStudies: CaseStudyEntry[] = content.caseStudies

export interface Exploration {
  name: string
  subtitle?: string
  description: string
  status: ProjectStatus
}

export const explorations: Exploration[] = [
  {
    name: 'Lamma',
    subtitle: 'Digital Wallet',
    description:
      'A concept exploring database-driven financial applications and digital wallet management.',
    status: 'concept',
  },
  {
    name: 'Night Shift',
    subtitle: 'Event Ticketing Platform',
    description: 'A concept for a web-based event management and ticketing system.',
    status: 'concept',
  },
]

export const getProject = (slug: string | undefined) => projects.find((p) => p.slug === slug)

export const getCaseStudy = (slug: string | undefined) => caseStudies.find((c) => c.slug === slug)

export const projectIndex = (slug: string) =>
  String(projects.findIndex((p) => p.slug === slug) + 1).padStart(2, '0')

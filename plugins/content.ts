import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { Marked, type Token, type Tokens } from 'marked'
import type { Plugin } from 'vite'
import {
  CASE_STUDY_TYPES,
  PROJECT_STATUSES,
  VISUAL_KEYS,
  type CaseStudyEntry,
  type ContentData,
  type ContentSection,
  type ProjectEntry,
} from '../src/content/types'

/**
 * Markdown content collections.
 *
 *   content/projects/<slug>.md       → a project board + /projects/<slug>
 *   content/case-studies/<slug>.md   → a case-study row + /case-studies/<slug>
 *
 * Files are read and validated at build time (any problem fails the build
 * with the file and field named), Markdown is rendered to HTML here, and
 * the result is served to the app as `virtual:content`. `draft: true`
 * entries are included in `npm run dev` only.
 */

export const REQUIRED_PROJECT_SECTIONS = ['Overview', 'The problem', 'My role', 'What I learned'] as const

const md = new Marked({ gfm: true })
// Content lives in the repo and is trusted, but raw HTML is still dropped.
md.use({ renderer: { html: () => '' } })

/** Markdown inline text → plain text (formatting and raw HTML removed). */
const plain = (s: string) =>
  (md.parseInline(s) as string)
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim()

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

class ContentError extends Error {
  constructor(file: string, message: string) {
    super(`[content] ${file}: ${message}`)
  }
}

function sectionsOf(file: string, body: string): ContentSection[] {
  const tokens = md.lexer(body)
  const sections: { title: string; tokens: Token[] }[] = []
  for (const t of tokens) {
    if (t.type === 'heading' && (t as Tokens.Heading).depth === 2) {
      sections.push({ title: (t as Tokens.Heading).text.trim(), tokens: [] })
    } else if (t.type === 'space') {
      continue
    } else if (!sections.length) {
      throw new ContentError(file, 'text must start with a "## Heading"')
    } else {
      sections[sections.length - 1].tokens.push(t)
    }
  }
  const ids = new Set<string>()
  return sections.map(({ title, tokens: ts }) => {
    const id = slugify(title)
    if (ids.has(id)) throw new ContentError(file, `duplicate section "## ${title}"`)
    ids.add(id)
    const items: string[] = []
    for (const t of ts) {
      if (t.type === 'paragraph') items.push(plain((t as Tokens.Paragraph).text))
      else if (t.type === 'list') for (const li of (t as Tokens.List).items) items.push(plain(li.text))
    }
    const list = Object.assign(ts, { links: tokens.links })
    return { id, title, html: md.parser(list as Parameters<typeof md.parser>[0]), items }
  })
}

const readingTime = (body: string) => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220))

type Data = Record<string, unknown>

function field<T>(file: string, data: Data, key: string, check: (v: unknown) => v is T, hint: string): T {
  const v = data[key]
  if (!check(v)) throw new ContentError(file, `"${key}" ${v === undefined ? 'is missing' : 'is invalid'} (${hint})`)
  return v
}
const isText = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const isTextList = (v: unknown): v is string[] => Array.isArray(v) && v.length > 0 && v.every(isText)
const oneOf =
  <T extends string>(list: readonly T[]) =>
  (v: unknown): v is T =>
    typeof v === 'string' && (list as readonly string[]).includes(v)
const isBool = (v: unknown): v is boolean => typeof v === 'boolean'

function readDir(root: string, dir: string) {
  const full = path.join(root, dir)
  let names: string[]
  try {
    names = readdirSync(full)
  } catch {
    return []
  }
  return names
    .filter((n) => n.endsWith('.md'))
    .map((name) => {
      const file = `${dir}/${name}`
      const slug = name.slice(0, -3)
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
        throw new ContentError(file, 'file name must be lowercase-words-with-dashes, e.g. my-project.md')
      }
      const { data, content } = matter(readFileSync(path.join(full, name), 'utf8'))
      return { file, slug, data: data as Data, body: content }
    })
}

function parseProject({ file, slug, data, body }: ReturnType<typeof readDir>[number]): ProjectEntry {
  const sections = sectionsOf(file, body)
  for (const title of REQUIRED_PROJECT_SECTIONS) {
    const s = sections.find((x) => x.title === title)
    if (!s || !s.items.length) throw new ContentError(file, `needs a non-empty "## ${title}" section`)
  }
  const statusNote = data.statusNote == null ? undefined : field(file, data, 'statusNote', isText, 'short text')
  return {
    slug,
    name: field(file, data, 'name', isText, 'text'),
    order: field(file, data, 'order', isNum, 'a number'),
    category: field(file, data, 'category', isText, 'text'),
    status: field(file, data, 'status', oneOf(PROJECT_STATUSES), PROJECT_STATUSES.join(' | ')),
    ...(statusNote ? { statusNote } : {}),
    summary: field(file, data, 'summary', isText, 'one sentence'),
    origin: field(file, data, 'origin', isText, 'short text'),
    role: field(file, data, 'role', isText, 'short text'),
    focus: field(file, data, 'focus', isText, 'short text'),
    visual: field(file, data, 'visual', oneOf(VISUAL_KEYS), VISUAL_KEYS.join(' | ')),
    disciplines: field(file, data, 'disciplines', isTextList, 'a list of text'),
    draft: data.draft === undefined ? false : field(file, data, 'draft', isBool, 'true | false'),
    readingTime: readingTime(body),
    sections,
  }
}

function parseCaseStudy({ file, slug, data, body }: ReturnType<typeof readDir>[number]): CaseStudyEntry {
  const sections = sectionsOf(file, body)
  if (!sections.length) throw new ContentError(file, 'needs at least one "## Heading" section')
  const project = data.project == null ? null : field(file, data, 'project', isText, 'a project slug')
  return {
    slug,
    title: field(file, data, 'title', isText, 'text'),
    order: field(file, data, 'order', isNum, 'a number'),
    type: field(file, data, 'type', oneOf(CASE_STUDY_TYPES), CASE_STUDY_TYPES.join(' | ')),
    project,
    summary: field(file, data, 'summary', isText, 'one sentence'),
    draft: data.draft === undefined ? false : field(file, data, 'draft', isBool, 'true | false'),
    readingTime: readingTime(body),
    sections,
  }
}

const byOrder = <T extends { order: number; slug: string }>(a: T, b: T) =>
  a.order - b.order || a.slug.localeCompare(b.slug)

export interface LoadedContent extends ContentData {
  /** Files skipped because they are drafts (only filled when drafts are excluded). */
  skippedDrafts: string[]
}

export function loadContent(root: string, { includeDrafts }: { includeDrafts: boolean }): LoadedContent {
  const allProjects = readDir(root, 'content/projects').map(parseProject).sort(byOrder)
  const allCaseStudies = readDir(root, 'content/case-studies').map(parseCaseStudy).sort(byOrder)

  const projectSlugs = new Set(allProjects.map((p) => p.slug))
  for (const cs of allCaseStudies) {
    if (projectSlugs.has(cs.slug)) {
      throw new ContentError(`content/case-studies/${cs.slug}.md`, 'has the same file name as a project')
    }
    if (cs.project && !projectSlugs.has(cs.project)) {
      throw new ContentError(`content/case-studies/${cs.slug}.md`, `"project: ${cs.project}" does not match any project file`)
    }
  }

  const keep = <T extends { draft: boolean }>(x: T) => includeDrafts || !x.draft
  const skippedDrafts = includeDrafts
    ? []
    : [
        ...allProjects.filter((p) => p.draft).map((p) => `content/projects/${p.slug}.md`),
        ...allCaseStudies.filter((c) => c.draft).map((c) => `content/case-studies/${c.slug}.md`),
      ]
  const projects = allProjects.filter(keep)
  // A case study linked to a hidden draft project loses the link, not its page.
  const visible = new Set(projects.map((p) => p.slug))
  const caseStudies = allCaseStudies
    .filter(keep)
    .map((c) => (c.project && !visible.has(c.project) ? { ...c, project: null } : c))
  return { projects, caseStudies, skippedDrafts }
}

const VIRTUAL_ID = 'virtual:content'
const RESOLVED_ID = '\0' + VIRTUAL_ID

export function contentPlugin(): Plugin {
  let root = process.cwd()
  let includeDrafts = false
  return {
    name: 'portfolio-content',
    configResolved(c) {
      root = c.root
      includeDrafts = c.command === 'serve'
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined
    },
    load(id) {
      if (id !== RESOLVED_ID) return
      const { projects, caseStudies } = loadContent(root, { includeDrafts })
      const data: ContentData = { projects, caseStudies }
      return `export default ${JSON.stringify(data)}`
    },
    configureServer(server) {
      const dir = path.join(root, 'content')
      server.watcher.add(dir)
      const onChange = (file: string) => {
        if (!path.resolve(file).startsWith(path.resolve(dir))) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('change', onChange)
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}

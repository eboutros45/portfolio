import { site } from '../content/site'

/**
 * Single source of truth for per-route metadata, shared by the build plugin
 * (plugins/seo.ts, which passes content loaded from disk) and the client
 * (useDocumentMeta, which passes `virtual:content`). Kept free of the
 * virtual module so it also runs in Node.
 */
export interface RouteMeta {
  path: string
  title: string
  description: string
}

export interface MetaContent {
  projects: { slug: string; name: string; category: string; summary: string }[]
  caseStudies: { slug: string; title: string; summary: string }[]
}

export function routeMeta(pathname: string, content: MetaContent): RouteMeta {
  const project = pathname.match(/^\/projects\/([^/]+)\/?$/)
  if (project) {
    const p = content.projects.find((x) => x.slug === project[1])
    if (p) {
      return {
        path: `/projects/${p.slug}`,
        title: `${p.name} — ${p.category} | ${site.name}`,
        description: `${p.summary} A case study by ${site.name}.`,
      }
    }
  }
  const study = pathname.match(/^\/case-studies\/([^/]+)\/?$/)
  if (study) {
    const c = content.caseStudies.find((x) => x.slug === study[1])
    if (c) {
      return {
        path: `/case-studies/${c.slug}`,
        title: `${c.title} | ${site.name}`,
        description: `${c.summary} A case study by ${site.name}.`,
      }
    }
  }
  if (pathname === '/' || pathname === '') {
    return {
      path: '/',
      title: `${site.name} — ${site.role}`,
      description: site.description,
    }
  }
  return { path: pathname, title: `Page not found | ${site.name}`, description: site.description }
}

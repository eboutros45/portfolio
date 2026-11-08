import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import { ACTIVE_DESIGN, designs } from '../src/content/designs'
import { contact, site } from '../src/content/site'
import { ACTIVE_THEME, themes } from '../src/content/themes'
import { loadContent } from './content'
import { routeMeta, type RouteMeta } from '../src/lib/meta'

/**
 * Build-time SEO for a client-rendered SPA on Cloudflare Pages.
 *
 * - `index.html` contains a `<!--seo-head-->` marker.
 * - In dev, the marker is replaced with the homepage metadata.
 * - On build, one HTML file is written per route with that route's own
 *   title / description / canonical / Open Graph tags:
 *     dist/index.html
 *     dist/projects/fawaros.html   → served by Pages at /projects/fawaros
 *   Link previews (LinkedIn, Slack, X…) therefore see correct metadata
 *   without executing JavaScript.
 * - A sitemap.xml is generated from the same route list.
 * - Unknown URLs fall back to index.html (Pages' default SPA behaviour when
 *   no top-level 404.html exists), where React renders the 404 page.
 */

const MARKER = '<!--seo-head-->'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function personJsonLd() {
  const sameAs = [contact.linkedin, contact.github].filter(Boolean)
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: site.url,
    jobTitle: site.role,
    address: { '@type': 'PostalAddress', addressCountry: 'LB' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Lebanese American University' },
    ...(sameAs.length ? { sameAs } : {}),
  }
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
}

export function renderHead(meta: RouteMeta) {
  const url = site.url + (meta.path === '/' ? '/' : meta.path)
  const image = site.url + site.ogImage
  return [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.path === '/' ? 'website' : 'article'}" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Elie Boutros — ${esc(site.role)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    ...(meta.path === '/' ? [personJsonLd()] : []),
  ].join('\n    ')
}

function sitemap(routes: RouteMeta[]) {
  const urls = routes
    .map((r) => `  <url><loc>${site.url}${r.path === '/' ? '/' : r.path}</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function seoPages(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'portfolio-seo-pages',
    configResolved(c) {
      config = c
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const theme = themes.find((t) => t.id === ACTIVE_THEME)!
        const design = designs.find((d) => d.id === ACTIVE_DESIGN)!
        const themeColor = design.id === 'classic' ? theme.meta : design.meta
        html = html
          .replace('<html lang="en">', `<html lang="en" data-theme="${theme.id}" data-design="${design.id}">`)
          .replace(/<meta name="theme-color" content="[^"]*" \/>/, `<meta name="theme-color" content="${themeColor}" />`)
        // Dev server: inject homepage meta. Build: keep the marker for writeBundle.
        if (!ctx.server) return html
        const content = loadContent(config.root, { includeDrafts: true })
        return html.replace(MARKER, renderHead(routeMeta('/', content)))
      },
    },
    async writeBundle() {
      const outDir = path.resolve(config.root, config.build.outDir)
      const template = await readFile(path.join(outDir, 'index.html'), 'utf8')
      if (!template.includes(MARKER)) throw new Error('[seo] marker missing from built index.html')

      const content = loadContent(config.root, { includeDrafts: false })
      const routes: RouteMeta[] = [
        routeMeta('/', content),
        ...content.projects.map((p) => routeMeta(`/projects/${p.slug}`, content)),
        ...content.caseStudies.map((c) => routeMeta(`/case-studies/${c.slug}`, content)),
      ]

      for (const r of routes) {
        const file = r.path === '/' ? 'index.html' : `${r.path.slice(1)}.html`
        const target = path.join(outDir, file)
        await mkdir(path.dirname(target), { recursive: true })
        await writeFile(target, template.replace(MARKER, renderHead(r)))
      }
      await writeFile(path.join(outDir, 'sitemap.xml'), sitemap(routes))

      const missing = (Object.keys(contact) as (keyof typeof contact)[]).filter((k) => !contact[k])
      if (missing.length) {
        config.logger.warn(
          `\n[seo] Contact placeholders not set (hidden on the live site): ${missing.join(', ')}` +
            `\n      Edit src/content/site.ts to add them.\n`,
        )
      }
      if (content.skippedDrafts.length) {
        config.logger.warn(
          `\n[content] Drafts left out of the live site (set draft: false to publish):` +
            content.skippedDrafts.map((f) => `\n      ${f}`).join('') +
            '\n',
        )
      }
      if (!site.availability) {
        config.logger.warn(`[seo] site.availability is not set (the hero status line stays hidden).`)
      }
      config.logger.info(`[seo] wrote ${routes.length} route pages + sitemap.xml`)
    },
  }
}

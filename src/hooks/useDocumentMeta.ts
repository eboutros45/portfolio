import { useEffect } from 'react'
import content from 'virtual:content'
import { site } from '../content/site'
import { routeMeta } from '../lib/meta'

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

/**
 * Keeps <title>, description, canonical and OG tags in sync during
 * client-side navigation. The initial values come from the per-route HTML
 * generated at build time (plugins/seo.ts), using the same `routeMeta`.
 */
export function useDocumentMeta(pathname: string, { noindex = false } = {}) {
  useEffect(() => {
    const meta = routeMeta(pathname, content)
    const url = site.url + (meta.path === '/' ? '/' : meta.path)
    document.title = meta.title
    setMeta('meta[name="description"]', 'content', meta.description)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[property="og:title"]', 'content', meta.title)
    setMeta('meta[property="og:description"]', 'content', meta.description)

    let robots: HTMLMetaElement | null = null
    if (noindex) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      robots.content = 'noindex'
      document.head.appendChild(robots)
    }
    return () => robots?.remove()
  }, [pathname, noindex])
}

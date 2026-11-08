/**
 * Lazy route loaders, shared so links can prefetch a page's code on
 * hover/focus. By the time the visitor clicks, the chunk is usually cached.
 */
export const loadProjectPage = () => import('../pages/ProjectPage')

let prefetched = false
export function prefetchProjectPage() {
  if (prefetched) return
  prefetched = true
  loadProjectPage().catch(() => {
    prefetched = false
  })
}

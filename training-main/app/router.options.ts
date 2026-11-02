import type { RouterConfig } from 'nuxt/schema'
import type { RouteLocationNormalized } from 'vue-router'
import { START_LOCATION } from 'vue-router'
import type Lenis from 'lenis'

/**
 * Where a page starts. A new page always opens at the top; back and forward
 * return to where the visitor was; a #hash lands on its section below the
 * fixed header; changing only the query (the service search) never scrolls.
 *
 * With smooth scrolling on, the position goes through Lenis with
 * `immediate`, which also discards any glide still running from the previous
 * page — otherwise that momentum carries the new page down to the bottom.
 */
const samePath = (a: RouteLocationNormalized, b: RouteLocationNormalized) =>
  a.path.replace(/\/$/, '') === b.path.replace(/\/$/, '')

function hashTop(hash: string) {
  let el: Element | null = null
  try {
    el = document.querySelector(decodeURIComponent(hash))
  }
  catch {}
  if (!el) return undefined
  const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - margin - padding)
}

function go(top: number, lenis: Lenis | null, smooth = false) {
  if (lenis) lenis.scrollTo(top, { immediate: !smooth, force: true })
  else window.scrollTo({ top, left: 0, behavior: smooth ? 'smooth' : 'instant' })
}

export default {
  scrollBehavior(to, from, saved) {
    const nuxtApp = useNuxtApp()
    const router = useRouter()
    const lenis = (nuxtApp.$lenis as Lenis | null | undefined) ?? null

    // Same page: only a hash change moves the view.
    if (samePath(to, from) && from !== START_LOCATION) {
      if (to.hash && to.hash !== from.hash) {
        const top = hashTop(to.hash)
        if (top !== undefined) go(top, lenis, true)
      }
      else if (from.hash && !to.hash) {
        go(saved?.top ?? 0, lenis)
      }
      return false
    }

    // First load: the browser restores its own position.
    if (from === START_LOCATION) return saved ?? (to.hash ? { el: to.hash } : { top: 0 })

    // Stop any glide now, so it cannot keep moving while the next page loads.
    if (lenis) lenis.scrollTo(window.scrollY, { immediate: true, force: true })

    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce('page:loading:end', async () => {
        // With a page transition, wait until the old page has faded out, so it
        // never jumps to the top in front of the visitor.
        const transition = (nuxtApp as unknown as { '~transitionPromise'?: Promise<void> })['~transitionPromise']
        if (transition) await transition
        requestAnimationFrame(() => {
          if (router.currentRoute.value.fullPath === to.fullPath) {
            const top = saved?.top ?? (to.hash ? hashTop(to.hash) : undefined) ?? 0
            lenis?.resize()
            go(top, lenis)
          }
          resolve(false)
        })
      })
    })
  },
} satisfies RouterConfig

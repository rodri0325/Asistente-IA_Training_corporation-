import type gsapType from 'gsap'
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'
import type { SplitText as SplitTextType } from 'gsap/SplitText'
import type Lenis from 'lenis'
import 'lenis/dist/lenis.css'

export interface MotionTools {
  gsap: typeof gsapType
  ScrollTrigger: typeof ScrollTriggerType
  SplitText: typeof SplitTextType
}

/**
 * Smooth scrolling (Lenis) driven by GSAP's ticker, so ScrollTrigger and Lenis
 * read the same scroll position. Nothing runs when the visitor asks for
 * reduced motion: native scrolling, no scroll-linked animation.
 *
 * GSAP and Lenis are loaded as separate chunks, not in the entry bundle: the
 * page paints and hydrates first, the motion follows a moment later. Content
 * never waits for it (start states live in CSS under html.motion, with a
 * fallback that shows everything).
 */
export default defineNuxtPlugin((nuxtApp) => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const motion: Promise<MotionTools | null> = reduced
    ? Promise.resolve(null)
    : Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText'), import('lenis')])
        .then(([{ default: gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }]) => {
          gsap.registerPlugin(ScrollTrigger, SplitText)

          const lenis = new Lenis({ lerp: 0.12, anchors: { offset: -88 } })
          lenis.on('scroll', ScrollTrigger.update)
          gsap.ticker.add((time) => lenis.raf(time * 1000))
          gsap.ticker.lagSmoothing(0)
          // Read by app/router.options.ts when placing each new page.
          nuxtApp.provide('lenis', lenis)

          // app/router.options.ts places each new page (and stops any glide);
          // here Lenis and ScrollTrigger just re-measure the new layout.
          nuxtApp.hook('page:finish', () => {
            requestAnimationFrame(() => {
              lenis.resize()
              ScrollTrigger.refresh()
            })
          })

          return { gsap, ScrollTrigger, SplitText }
        })
        .catch(() => null)

  return { provide: { motion, reducedMotion: reduced } }
})

declare module '#app' {
  interface NuxtApp {
    /** Set once smooth scrolling has loaded; absent under reduced motion. */
    $lenis?: Lenis
  }
}

import type { Ref } from 'vue'
import type { MotionTools } from '~/plugins/motion.client'

/**
 * Runs a GSAP setup scoped to `scope` once GSAP has loaded (motion.client.ts)
 * and reverts it on unmount. Skipped entirely under prefers-reduced-motion, so
 * the setup must never be required for content to be visible: initial hidden
 * states live in CSS under `html.motion` (set before paint in app.vue), never
 * in markup.
 */
export function useMotion(scope: Ref<HTMLElement | null>, setup: (tools: MotionTools) => void) {
  const nuxtApp = useNuxtApp()
  let ctx: ReturnType<MotionTools['gsap']['context']> | undefined
  let alive = true

  onMounted(async () => {
    const tools = await (nuxtApp.$motion as Promise<MotionTools | null> | undefined)
    if (!tools || !alive || !scope.value) return
    ctx = tools.gsap.context(() => setup(tools), scope.value)
  })

  onBeforeUnmount(() => {
    alive = false
    ctx?.revert()
  })
}

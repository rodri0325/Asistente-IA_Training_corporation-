/**
 * Page changes fade (see main.css). Moving inside the same page — another
 * line or unit in the service explorer — swaps content instantly, like tabs,
 * and so does every change when the visitor asks for reduced motion.
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const reduced = import.meta.client && useNuxtApp().$reducedMotion
  if (reduced || to.name === from.name) to.meta.pageTransition = false
})

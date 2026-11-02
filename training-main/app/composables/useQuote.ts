import { createGlobalState, useLocalStorage } from '@vueuse/core'
import type { ModeId } from '~/data/services'

export interface QuoteItem {
  mode: ModeId
  line: string
  text: string
}

const keyOf = (i: QuoteItem) => `${i.mode}|${i.line}|${i.text}`

/**
 * Services the visitor has marked while browsing, sent together from the
 * contact form. Kept in this browser (B2B buyers research over several days)
 * and read after mount (initOnMounted) so prerendered HTML never disagrees
 * with the client. `announcement` feeds a polite live region.
 */
export const useQuote = createGlobalState(() => {
  const items = useLocalStorage<QuoteItem[]>('tc-solicitud', [], { initOnMounted: true })
  const announcement = ref('')
  /** Increments on every add, so the bar can acknowledge it visually. */
  const pulse = ref(0)

  const count = computed(() => items.value.length)
  const say = (verb: string, i: QuoteItem) => {
    const n = items.value.length
    announcement.value = `${verb}: ${i.text}. ${n} ${n === 1 ? 'servicio' : 'servicios'} en su solicitud.`
  }

  const has = (i: QuoteItem) => items.value.some((x) => keyOf(x) === keyOf(i))
  const remove = (i: QuoteItem) => {
    items.value = items.value.filter((x) => keyOf(x) !== keyOf(i))
    say('Quitado', i)
  }
  const add = (i: QuoteItem) => {
    if (has(i)) return
    items.value = [...items.value, i]
    pulse.value++
    say('Agregado', i)
  }
  const toggle = (i: QuoteItem) => (has(i) ? remove(i) : add(i))
  const clear = () => {
    items.value = []
    announcement.value = 'Solicitud vaciada.'
  }

  return { items, has, add, remove, toggle, clear, count, announcement, pulse }
})

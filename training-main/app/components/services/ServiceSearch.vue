<script setup lang="ts">
import { Search, X } from '@lucide/vue'
import { modes, services, findMode, servicePath } from '~/data/services'
import type { ModeId } from '~/data/services'

/**
 * Find a service by standard, topic or word across the three units and five
 * lines ("45001", "CREG 015", "auditores internos"). Accent- and
 * case-insensitive; every word must match. Results can join the quote request.
 */
const props = withDefaults(defineProps<{ mode?: ModeId, tone?: 'blanco' | 'azul', syncUrl?: boolean }>(), { tone: 'blanco', syncUrl: true })

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const index = services.flatMap((line) =>
  modes.flatMap((m) => line.offers[m.id].flatMap((g) => g.items.map((text) => ({
    mode: m.id,
    line: line.slug,
    lineName: line.short === 'HSEQ' ? 'HSEQ' : line.name,
    area: g.area,
    text,
    haystack: fold(`${text} ${g.area ?? ''} ${line.name} ${line.short} ${m.name}`),
  })))),
)

const suggestions = ['45001', '55001', '27001', '17025', 'CREG', 'MIPG', 'auditores internos', 'seguridad vial']

const id = useId()
const query = ref('')
const input = useTemplateRef<HTMLInputElement>('input')
const words = computed(() => fold(query.value).split(/\s+/).filter((w) => w.length > 1))

const matches = computed(() => {
  if (!words.value.length) return []
  return index.filter((i) => (!props.mode || i.mode === props.mode) && words.value.every((w) => i.haystack.includes(w)))
})
const LIMIT = 12
const showAll = ref(false)
watch(query, () => { showAll.value = false })
const shown = computed(() => (showAll.value ? matches.value : matches.value.slice(0, LIMIT)))

// The live region waits for a pause in typing, so a screen reader hears the
// result once instead of after every keystroke.
const status = ref('')
const describe = () => {
  if (!words.value.length) return ''
  const n = matches.value.length
  if (!n) return 'Ningún servicio coincide. Pruebe con el número de la norma o una sola palabra.'
  return `${n} ${n === 1 ? 'servicio' : 'servicios'}${n > shown.value.length ? `; se muestran los primeros ${shown.value.length}` : ''}`
}
const announce = useDebounceFn(() => { status.value = describe() }, 400)
watch([words, shown], () => (words.value.length ? announce() : (status.value = '')))

// The search lives in the URL (?q=), so going back from a result returns to
// the same list and a search can be shared. Read after mount: pages are prerendered.
const route = useRoute()
const router = useRouter()
onMounted(() => {
  const q = route.query.q
  if (typeof q === 'string' && q) query.value = q
})
const here = route.path
const syncUrl = useDebounceFn((q: string) => {
  if (!props.syncUrl) return
  // A result may have been clicked before the pause ended; never touch another page's URL.
  const now = router.currentRoute.value
  if (now.path !== here || (now.query.q ?? '') === q.trim()) return
  router.replace({ path: here, query: { ...now.query, q: q.trim() || undefined }, hash: now.hash })
}, 500)
watch(query, (q) => syncUrl(q))

// The button disappears once pressed; keyboard focus moves to the first newly shown result.
const list = useTemplateRef<HTMLUListElement>('list')
async function expand() {
  showAll.value = true
  await nextTick()
  list.value?.querySelectorAll<HTMLAnchorElement>('.result__where')[LIMIT]?.focus()
}

function use(s: string) {
  query.value = s
  input.value?.focus()
}
</script>

<template>
  <div class="search" :class="`search--${tone}`">
    <label :for="`${id}-q`" class="search__label">
      {{ mode ? `Buscar en ${findMode(mode)?.name.toLowerCase()}` : 'Buscar un servicio' }}
    </label>
    <div class="search__box">
      <Search class="search__icon" aria-hidden="true" />
      <input
        :id="`${id}-q`"
        ref="input"
        v-model="query"
        type="search"
        class="search__input"
        placeholder="Norma, tema o palabra"
        autocomplete="off"
        :aria-describedby="`${id}-status`"
        enterkeyhint="search"
        @keydown.esc="query = ''"
      >
      <button v-if="query" type="button" class="search__clear" @click="use('')">
        <X aria-hidden="true" /><span class="visually-hidden">Borrar la búsqueda</span>
      </button>
    </div>

    <div v-if="!query" class="search__suggest">
      <span class="search__hint">Pruebe:</span>
      <button v-for="s in suggestions" :key="s" type="button" class="search__chip" @click="use(s)">{{ s }}</button>
    </div>

    <p :id="`${id}-status`" class="search__status" aria-live="polite">{{ status }}</p>

    <ul v-if="shown.length" ref="list" class="results">
      <li v-for="r in shown" :key="`${r.mode}${r.line}${r.text}`" class="result">
        <div class="result__body">
          <p class="result__meta">
            <NuxtLink :to="servicePath(r.mode, r.line)" class="result__where">
              {{ findMode(r.mode)?.name }} en {{ r.lineName }}<template v-if="r.area">, {{ r.area.toLowerCase() }}</template>
            </NuxtLink>
          </p>
          <p class="result__text">{{ r.text }}</p>
        </div>
        <QuoteToggle :mode="r.mode" :line="r.line" :text="r.text" />
      </li>
    </ul>
    <button v-if="matches.length > shown.length" type="button" class="search__more" @click="expand">
      {{ matches.length - shown.length === 1 ? 'Ver el restante' : `Ver los ${matches.length - shown.length} restantes` }}
    </button>
  </div>
</template>

<style scoped>
.search__label {
  display: block;
  margin-bottom: 0.625rem;
  font-family: var(--font-display);
  font-weight: 700;
}

.search__box {
  position: relative;
}

.search__icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  width: 1.25rem;
  height: 1.25rem;
  transform: translateY(-50%);
  color: var(--color-azul);
  pointer-events: none;
}

.search__input {
  width: 100%;
  min-height: 3.5rem;
  padding: 0.75rem 3.25rem 0.75rem 3rem;
  border: 2px solid var(--color-linea);
  border-radius: var(--radius-control);
  background: var(--color-blanco);
  font: inherit;
  font-size: var(--text-base);
  color: var(--color-tinta);
}

.search__input::placeholder {
  color: var(--color-pizarra);
}

.search__input:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 0;
  border-color: var(--color-azul);
}

.search__input::-webkit-search-cancel-button {
  display: none;
}

.search__clear {
  position: absolute;
  right: 0.375rem;
  top: 50%;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  transform: translateY(-50%);
  border-radius: var(--radius-full);
  color: var(--color-pizarra);
  cursor: pointer;
}

.search__clear:hover {
  background: var(--color-nube);
}

.search__clear svg {
  width: 1.125rem;
  height: 1.125rem;
}

.search__suggest {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.875rem;
}

.search__hint {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-pizarra);
}

.search__chip {
  min-height: 2.25rem;
  padding: 0.25rem 0.875rem;
  border: 1px solid var(--color-linea);
  border-radius: var(--radius-full);
  background: var(--color-blanco);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-azul-hondo);
  cursor: pointer;
}

.search__chip:hover {
  border-color: var(--color-azul);
}

.search__status {
  margin-top: 0.875rem;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-pizarra);
}

.search__status:empty {
  margin: 0;
}

.results {
  margin-top: 0.5rem;
  border-top: 1px solid var(--color-linea);
}

.result {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  padding-block: 0.875rem;
  border-bottom: 1px solid var(--color-linea);
}

.result__meta {
  font-size: var(--text-xs);
  line-height: 1.4;
}

.result__where {
  font-weight: 700;
  color: var(--color-azul-hondo);
}

.result__text {
  margin-top: 0.125rem;
}

.search__more {
  margin-top: 1rem;
  min-height: 2.75rem;
  padding: 0.375rem 1.125rem;
  border: 2px solid var(--color-azul);
  border-radius: var(--radius-control);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-azul);
  cursor: pointer;
}

.search__more:hover {
  background: var(--color-nube);
}

/* On the blue explorer header the label and hints sit on white text. */
.search--azul .search__label,
.search--azul .search__hint,
.search--azul .search__status {
  color: var(--color-blanco);
}

.search--azul .search__more {
  border-color: var(--color-blanco);
  color: var(--color-blanco);
}

.search--azul .search__more:hover {
  background: rgb(255 255 255 / 0.12);
}

.search--azul .search__input {
  border-color: transparent;
}

.search--azul .results {
  padding: 0 1rem;
  border-top: 0;
  border-radius: var(--radius-control);
  background: var(--color-blanco);
  color: var(--color-tinta);
}
</style>

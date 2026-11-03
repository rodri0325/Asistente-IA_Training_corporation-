<script setup lang="ts">
import { MessageCircle, ClipboardList, X, ChevronUp } from '@lucide/vue'
import { company } from '~/data/company'
import { findMode, findService } from '~/data/services'

/**
 * Bottom-right actions present on every page: WhatsApp, and — once the
 * visitor has marked services — their quote request, which can be reviewed,
 * edited and sent from here. Hidden on /contacto, where the form shows it.
 */
const quote = useQuote()
const route = useRoute()
const open = ref(false)
const panel = useTemplateRef<HTMLElement>('panel')

const onContact = computed(() => route.path === '/contacto')
const showQuote = computed(() => quote.count.value > 0 && !onContact.value)

watch(() => route.fullPath, () => { open.value = false })

// Reserve room at the bottom of the page so the bar never hides the last content.
watchEffect(() => {
  if (import.meta.client) document.documentElement.classList.toggle('has-quote', showQuote.value)
})

// Brief acknowledgement on the bar each time a service is added.
const bump = ref(false)
watch(quote.pulse, () => {
  bump.value = false
  requestAnimationFrame(() => { bump.value = true })
})
watch(quote.count, (n) => { if (!n) open.value = false })
onClickOutside(panel, () => { open.value = false })
onKeyStroke('Escape', () => { open.value = false })

const label = (mode: string, line: string) => `${findMode(mode)?.name ?? ''}, ${findService(line)?.short ?? ''}`
</script>

<template>
  <aside class="fab" :class="{ 'fab--quote': showQuote }" aria-label="Acciones rápidas">
    <Transition name="pop">
      <div v-if="showQuote" ref="panel" class="quote">
        <div v-show="open" id="quote-list" class="quote__list">
          <p class="quote__title">Su solicitud</p>
          <ul>
            <li v-for="i in quote.items.value" :key="`${i.mode}${i.line}${i.text}`" class="quote__item">
              <span>
                <span class="quote__meta">{{ label(i.mode, i.line) }}</span>
                {{ i.text }}
              </span>
              <button type="button" class="quote__remove" @click="quote.remove(i)">
                <X aria-hidden="true" /><span class="visually-hidden">Quitar {{ i.text }}</span>
              </button>
            </li>
          </ul>
          <button type="button" class="quote__clear" @click="quote.clear()">Vaciar la solicitud</button>
        </div>
        <div class="quote__bar" :class="{ 'is-bump': bump }" @animationend="bump = false">
          <button type="button" class="quote__toggle" :aria-expanded="open" aria-controls="quote-list" @click="open = !open">
            <ClipboardList aria-hidden="true" />
            <span><strong>{{ quote.count.value }}</strong> {{ quote.count.value === 1 ? 'servicio' : 'servicios' }}</span>
            <ChevronUp class="quote__chev" aria-hidden="true" />
          </button>
          <NuxtLink to="/contacto?asunto=cotizacion" class="quote__send">
            <span class="quote__send-long">Solicitar cotización</span><span class="quote__send-short" aria-hidden="true">Cotizar</span>
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <p class="visually-hidden" aria-live="polite">{{ quote.announcement.value }}</p>

    <a :href="company.whatsapp.href" class="wa" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp al 321 707 9467">
      <MessageCircle aria-hidden="true" />
    </a>
  </aside>
</template>

<style scoped>
.fab {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  z-index: 30;
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  pointer-events: none;
}

.fab > * {
  pointer-events: auto;
}

.wa {
  display: grid;
  place-items: center;
  flex: none;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--radius-full);
  background: var(--color-azul);
  color: var(--color-blanco);
  box-shadow: 0 10px 24px -10px rgb(11 44 71 / 0.6);
  transition: transform var(--duration-base) var(--ease-out), background-color var(--duration-fast) var(--ease-out);
}

.wa:hover {
  background: var(--color-azul-hondo);
  transform: translateY(-2px);
}

.wa svg {
  width: 1.625rem;
  height: 1.625rem;
}

.quote {
  position: relative;
  width: min(26rem, calc(100vw - 6rem));
}

.quote__bar {
  display: flex;
  align-items: stretch;
  min-height: 3.5rem;
  border-radius: var(--radius-full);
  background: var(--color-noche);
  color: var(--color-blanco);
  box-shadow: 0 10px 24px -10px rgb(11 44 71 / 0.6);
  overflow: hidden;
}

.quote__bar.is-bump {
  animation: bump 420ms var(--ease-out);
}

@keyframes bump {
  30% { transform: scale(1.04); }
  100% { transform: scale(1); }
}

.quote__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding-inline: 1.125rem 0.75rem;
  font-size: var(--text-sm);
  color: inherit;
  cursor: pointer;
}

.quote__toggle svg {
  width: 1.25rem;
  height: 1.25rem;
  flex: none;
}

.quote__chev {
  transition: transform var(--duration-base) var(--ease-out);
}

.quote__toggle[aria-expanded='true'] .quote__chev {
  transform: rotate(180deg);
}

.quote__send {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  padding-inline: 1.25rem;
  background: var(--color-azul);
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-blanco);
  text-decoration: none;
  white-space: nowrap;
}

.quote__send:hover {
  background: var(--color-azul-vivo);
}

.quote__list {
  position: absolute;
  right: 0;
  bottom: calc(100% + 0.75rem);
  width: 100%;
  max-height: min(60vh, 28rem);
  overflow-y: auto;
  padding: 1.25rem;
  background: var(--color-blanco);
  border: 1px solid var(--color-linea);
  border-radius: 12px;
  box-shadow: 0 24px 48px -24px rgb(11 44 71 / 0.45);
}

.quote__title {
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
  font-weight: 700;
}

.quote__item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  padding-block: 0.625rem;
  border-bottom: 1px solid var(--color-linea);
  font-size: var(--text-xs);
}

.quote__meta {
  display: block;
  font-weight: 700;
  color: var(--color-azul-hondo);
}

.quote__remove {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-full);
  color: var(--color-pizarra);
  cursor: pointer;
}

.quote__remove:hover {
  background: var(--color-nube);
  color: var(--color-error);
}

.quote__remove svg {
  width: 1rem;
  height: 1rem;
}

.quote__clear {
  margin-top: 0.75rem;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-pizarra);
  text-decoration: underline;
  text-underline-offset: 0.2em;
  cursor: pointer;
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(0.75rem) scale(0.96);
}

.quote__send-short {
  display: none;
}

@media (width < 30rem) {
  .quote__toggle span {
    white-space: nowrap;
  }

  .quote__send {
    padding-inline: 1.25rem;
  }

  /* The visible label shortens; the accessible name stays complete. */
  .quote__send-long {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }

  .quote__send-short {
    display: inline;
  }
}

/* On phones the quote bar takes priority; WhatsApp stays in the footer and contact page. */
@media (width < 40rem) {
  .fab--quote .wa {
    display: none;
  }

  .quote {
    width: calc(100vw - 2rem);
  }
}

@media print {
  .fab { display: none; }
}
</style>

<style>
/* Room for the floating bar at the end of every page and for focused elements. */
html.has-quote {
  scroll-padding-bottom: 6rem;
}

html.has-quote footer.footer {
  padding-bottom: 5.5rem;
}
</style>

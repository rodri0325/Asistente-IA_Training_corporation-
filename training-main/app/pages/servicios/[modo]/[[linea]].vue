<script setup lang="ts">
import { FileText, ChevronLeft, ChevronRight } from '@lucide/vue'
import { modes, services, findMode, findService, countOffers, servicePath, servicesLabel } from '~/data/services'
import type { ModeId } from '~/data/services'

/**
 * Service explorer: unit (auditoría / consultoría / formación) → line →
 * services. Every combination is its own prerendered URL, so it can be
 * shared and indexed.
 */
const route = useRoute()
const mode = findMode(String(route.params.modo))
const lineSlug = route.params.linea ? String(route.params.linea) : undefined
const line = lineSlug ? findService(lineSlug) : undefined

if (!mode || (lineSlug && !line)) {
  throw createError({ statusCode: 404, statusMessage: 'Servicio no encontrado', fatal: true })
}

const modeId = mode.id as ModeId
const lines = services.map((s) => ({ ...s, count: countOffers(s, modeId) }))
const total = lines.reduce((n, l) => n + l.count, 0)
const lineName = (l: { short: string, name: string }) => (l.short === 'HSEQ' ? 'sistemas HSEQ' : l.name.toLowerCase())

// Previous / next line, so the end of a list is never a dead end.
const at = line ? lines.findIndex((l) => l.slug === line.slug) : -1
const prev = at > 0 ? lines[at - 1] : undefined
const next = at >= 0 && at < lines.length - 1 ? lines[at + 1] : undefined

const quote = useQuote()

usePageSeo(line
  ? {
      title: `${mode.name} en ${line.short === 'HSEQ' ? 'sistemas HSEQ' : line.name.toLowerCase()}`,
      description: `${servicesLabel(countOffers(line, modeId))} de ${mode.name.toLowerCase()} en ${line.name}: ${line.offers[modeId].flatMap((g) => g.items).slice(0, 3).join('; ')}.`,
    }
  : {
      title: { auditoria: 'Auditoría de sistemas de gestión ISO y CREG', consultoria: 'Consultoría en sistemas de gestión ISO', formacion: 'Cursos y formación de auditores internos ISO' }[modeId] ?? mode.name,
      description: `${mode.summary} ${total} servicios en HSEQ, gestión de activos, regulación del sector eléctrico, seguridad de la información y laboratorios.`,
    })
</script>

<template>
  <div v-if="mode">
    <PageHeader
      :title="line ? `${mode.name} en ${lineName(line)}` : mode.name"
      :crumb="line ? line.short : mode.name"
      :lede="line ? line.lede : mode.summary"
      compact
      :crumbs="line
        ? [{ label: 'Servicios', to: '/portafolio-de-servicios' }, { label: mode.name, to: servicePath(modeId) }]
        : [{ label: 'Servicios', to: '/portafolio-de-servicios' }]"
    >
    </PageHeader>

    <nav class="modes" aria-label="Tipo de servicio">
      <div class="frame">
        <ul class="modes__list">
          <li v-for="m in modes" :key="m.id">
            <NuxtLink
              :to="servicePath(m.id, lineSlug)"
              class="modes__link"
              :aria-current="m.id === modeId ? 'page' : undefined"
            >
              {{ m.name }}
              <span class="modes__unit">{{ m.unit }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <div class="frame grid-page explorer">
      <nav class="lines" :aria-label="`Líneas de ${mode.name.toLowerCase()}`">
        <p class="lines__title">Elija la línea</p>
        <ul class="lines__list">
          <li v-for="l in lines" :key="l.slug">
            <NuxtLink
              :to="servicePath(modeId, l.slug)"
              class="lines__link"
              :aria-current="l.slug === lineSlug ? 'page' : undefined"
            >
              <span class="lines__name"><span class="lines__long">{{ l.name }}</span><span class="lines__short">{{ l.short }}</span></span>
              <span class="lines__count">{{ l.count }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <section v-if="line" class="panel" aria-labelledby="panel-title">
        <h2 id="panel-title" class="visually-hidden">Servicios de {{ mode.name.toLowerCase() }} en {{ line.name }}</h2>
        <p class="panel__hint">
          {{ servicesLabel(countOffers(line, modeId)) }}. Agregue los que le interesen, de esta o de otras líneas, y envíelos juntos.
        </p>
        <OfferList :mode="modeId" :line="line.slug" :line-name="line.name" :groups="line.offers[modeId]" class="panel__offers" />
        <div class="panel__actions">
          <UiButton v-if="quote.count.value" to="/contacto?asunto=cotizacion">
            Enviar mi solicitud ({{ quote.count.value }})
          </UiButton>
          <UiButton v-else :to="{ path: '/contacto', query: { asunto: modeId === 'formacion' ? 'formacion' : 'cotizacion', linea: line.slug } }">
            Solicitar una propuesta
          </UiButton>
          <NuxtLink :to="`/portafolio-de-servicios/${line.slug}`" class="link">Todo sobre {{ line.short === 'HSEQ' ? 'HSEQ' : line.short.toLowerCase() }}</NuxtLink>
          <a :href="line.sourcePdf" class="link panel__pdf" target="_blank" rel="noopener"><FileText aria-hidden="true" />Portafolio (PDF)</a>
        </div>
        <nav class="pager" aria-label="Otras líneas">
          <NuxtLink v-if="prev" :to="servicePath(modeId, prev.slug)" class="pager__link" rel="prev">
            <ChevronLeft aria-hidden="true" />
            <span><span class="pager__label">Anterior</span>{{ mode.name }} en {{ lineName(prev) }}</span>
          </NuxtLink>
          <NuxtLink v-if="next" :to="servicePath(modeId, next.slug)" class="pager__link pager__link--next" rel="next">
            <span><span class="pager__label">Siguiente</span>{{ mode.name }} en {{ lineName(next) }}</span>
            <ChevronRight aria-hidden="true" />
          </NuxtLink>
        </nav>
      </section>

      <section v-else class="panel" aria-labelledby="panel-title">
        <h2 id="panel-title" class="visually-hidden">Líneas de {{ mode.name.toLowerCase() }}</h2>
        <ServiceSearch :mode="modeId" class="panel__search" />
        <ul class="overview">
          <li v-for="l in lines" :key="l.slug" class="overview__item">
            <NuxtLink :to="servicePath(modeId, l.slug)" class="overview__link">
              <span class="overview__name">{{ l.name }}</span>
              <ul class="overview__samples">
                <li v-for="s in l.offers[modeId].flatMap((g) => g.items).slice(0, 3)" :key="s">{{ s }}</li>
              </ul>
              <span class="overview__more">{{ l.count === 1 ? 'Ver el servicio' : `Ver los ${l.count} servicios` }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.modes {
  position: sticky;
  top: var(--header-offset);
  z-index: 10;
  background: var(--color-blanco);
  border-bottom: 1px solid var(--color-linea);
}

.modes__list {
  display: flex;
  gap: 0.25rem;
}

.modes__link {
  position: relative;
  display: inline-block;
  padding: 1rem clamp(0.5rem, 0.2rem + 1.5vw, 1.25rem);
  font-family: var(--font-display);
  font-size: clamp(0.9375rem, 0.8rem + 0.65vw, 1.375rem);
  font-weight: 700;
  color: var(--color-pizarra);
  text-decoration: none;
  white-space: nowrap;
}

.modes__link:hover {
  color: var(--color-azul);
}

/* The smallest phones: the three tabs still fit on one line. */
@media (width < 24rem) {
  .modes__list {
    gap: 0;
  }

  .modes__link {
    padding-inline: 0.4375rem;
    font-size: 0.875rem;
  }

  .modes__link[aria-current='page']::after {
    left: 0.4375rem;
    right: 0.4375rem;
  }
}

.modes__unit {
  display: none;
  margin-top: 0.125rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-pizarra);
}

.modes__link[aria-current='page'] {
  color: var(--color-azul);
}

.modes__link[aria-current='page']::after {
  content: '';
  position: absolute;
  left: clamp(0.5rem, 0.2rem + 1.5vw, 1.25rem);
  right: clamp(0.5rem, 0.2rem + 1.5vw, 1.25rem);
  bottom: 0;
  height: 4px;
  border-radius: 4px 4px 0 0;
  background: var(--color-azul);
}

.explorer {
  row-gap: 2rem;
  padding-block: 2.5rem var(--spacing-section);
}

.lines,
.panel {
  grid-column: 1 / -1;
}

.lines__title {
  margin-bottom: 0.75rem;
  font-weight: 700;
  color: var(--color-pizarra);
}

.lines__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.lines__long {
  display: none;
}

.lines__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 3rem;
  padding: 0.625rem 1rem;
  border: 2px solid var(--color-linea);
  border-radius: var(--radius-control);
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-tinta);
  text-decoration: none;
  transition: border-color var(--duration-fast) var(--ease-out), background-color var(--duration-fast) var(--ease-out);
}

.lines__link:hover {
  border-color: var(--color-azul);
}

.lines__link[aria-current='page'] {
  border-color: var(--color-azul);
  background: var(--color-azul);
  color: var(--color-blanco);
}

.lines__count {
  display: grid;
  place-items: center;
  min-width: 1.75rem;
  height: 1.75rem;
  padding-inline: 0.375rem;
  border-radius: var(--radius-full);
  background: var(--color-nube);
  font-size: 0.8125rem;
  color: var(--color-azul-hondo);
}

.lines__link[aria-current='page'] .lines__count {
  background: var(--color-azul-hondo);
  color: var(--color-blanco);
}

.panel__title {
  color: var(--color-azul);
}

.panel__hint {
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: var(--color-pizarra);
}

.panel__search {
  margin-bottom: 2.5rem;
}

.pager {
  display: grid;
  gap: 0.75rem;
  margin-top: 3rem;
}

.pager__link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border: 2px solid var(--color-linea);
  border-radius: 10px;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-azul);
  text-decoration: none;
  transition: border-color var(--duration-fast) var(--ease-out);
}

.pager__link:hover {
  border-color: var(--color-azul);
}

.pager__link--next {
  justify-content: space-between;
  text-align: right;
}

.pager__link svg {
  flex: none;
  width: 1.25rem;
  height: 1.25rem;
}

.pager__label {
  display: block;
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-pizarra);
}

.panel__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.75rem;
  margin-top: 2.5rem;
}

.panel__pdf {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.panel__pdf svg {
  width: 1.125rem;
  height: 1.125rem;
}


.overview {
  display: grid;
  gap: 1rem;
}

.overview__link {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 0.75rem;
  height: 100%;
  padding: 1.5rem;
  border: 2px solid var(--color-linea);
  border-radius: 10px;
  color: inherit;
  text-decoration: none;
  transition: border-color var(--duration-fast) var(--ease-out);
}

.overview__link:hover {
  border-color: var(--color-azul);
}

.overview__name {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
  font-weight: 700;
  color: var(--color-azul);
}

.overview__samples {
  display: grid;
  align-content: start;
  gap: 0.375rem;
  color: var(--color-pizarra);
  font-size: var(--text-sm);
}

.overview__more {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-azul);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
}

.overview__link:hover .overview__more {
  text-decoration-thickness: 2px;
}

/* Phones: compact chips so all five lines fit in two rows above the list. */
@media (width < 64rem) {
  .lines__title {
    margin-bottom: 0.5rem;
    font-size: var(--text-xs);
  }

  .lines__link {
    min-height: 2.75rem;
    padding: 0.375rem 0.5rem 0.375rem 0.75rem;
    font-size: 0.875rem;
    gap: 0.5rem;
  }

  .lines__count {
    min-width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
  }

  .explorer {
    padding-top: 1.25rem;
    row-gap: 1.5rem;
  }
}

@media (width >= 48rem) {
  .modes__unit {
    display: block;
  }

  .overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (width >= 64rem) {
  .lines {
    grid-column: 1 / span 4;
    align-self: start;
  }

  .lines__list {
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .lines__long {
    display: inline;
  }

  .lines__short {
    display: none;
  }

  .pager {
    grid-template-columns: 1fr 1fr;
  }

  .pager__link--next {
    grid-column: 2;
  }

  .panel {
    grid-column: 5 / -1;
  }
}
</style>

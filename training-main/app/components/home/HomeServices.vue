<script setup lang="ts">
import { modes, services, countOffers, servicesLabel, servicePath } from '~/data/services'
import type { ModeId } from '~/data/services'

/**
 * The company's three business units as tabs; each shows the five lines with
 * a few real services and a door into the explorer. Plain links underneath,
 * so it still works without JavaScript.
 */
const active = ref<ModeId>('auditoria')
const tabs = useTemplateRef<HTMLButtonElement[]>('tab')

function onKey(e: KeyboardEvent, i: number) {
  const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
  if (!step && e.key !== 'Home' && e.key !== 'End') return
  e.preventDefault()
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? modes.length - 1 : (i + step + modes.length) % modes.length
  active.value = modes[next]!.id
  tabs.value?.[next]?.focus()
}

const samples = (slug: string, mode: ModeId) =>
  services.find((s) => s.slug === slug)!.offers[mode].flatMap((g) => g.items).slice(0, 2)
</script>

<template>
  <section class="services field-azul section" aria-labelledby="services-title">
    <div class="frame">
      <div class="services__head">
        <h2 id="services-title" class="heading">¿Qué necesita su organización?</h2>
        <p class="services__lede">Elija el tipo de servicio y vea lo que hacemos en cada línea.</p>
      </div>

      <div class="tabs" role="tablist" aria-label="Tipo de servicio">
        <button
          v-for="(m, i) in modes"
          :id="`tab-${m.id}`"
          :key="m.id"
          ref="tab"
          type="button"
          role="tab"
          class="tab"
          :aria-selected="active === m.id"
          :aria-controls="`panel-${m.id}`"
          :tabindex="active === m.id ? 0 : -1"
          @click="active = m.id"
          @keydown="onKey($event, i)"
        >
          <span class="tab__name">{{ m.name }}</span>
          <span class="tab__unit">{{ m.unit }}</span>
        </button>
      </div>

      <div
        v-for="m in modes"
        :id="`panel-${m.id}`"
        :key="m.id"
        role="tabpanel"
        class="panel"
        :aria-labelledby="`tab-${m.id}`"
        :hidden="active !== m.id"
        tabindex="0"
      >
        <p class="panel__summary">{{ m.summary }}</p>
        <ul class="lines">
          <li v-for="l in services" :key="l.slug">
            <NuxtLink :to="servicePath(m.id, l.slug)" class="line">
              <span class="line__name">{{ l.name }}</span>
              <span class="line__samples">
                <span v-for="s in samples(l.slug, m.id)" :key="s">{{ s }}</span>
              </span>
              <span class="line__count">{{ servicesLabel(countOffers(l, m.id)) }}</span>
            </NuxtLink>
          </li>
        </ul>
        <NuxtLink :to="servicePath(m.id)" class="panel__all">Explorar {{ m.name.toLowerCase() }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services__head {
  display: grid;
  gap: 1rem;
  max-width: 44rem;
}

.services__lede {
  font-size: var(--text-lg);
  line-height: var(--text-lg--line-height);
}

.tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 0.75rem;
  margin-top: 2.5rem;
  border-bottom: 2px solid rgb(255 255 255 / 0.35);
}

.tab {
  position: relative;
  display: grid;
  gap: 0.25rem;
  padding: 1rem 0.5rem 1.25rem 0;
  text-align: left;
  color: var(--color-blanco);
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out);
}

.tab:hover,
.tab[aria-selected='true'] {
  color: var(--color-blanco);
}

.tab::after {
  content: '';
  position: absolute;
  left: 0;
  right: 1rem;
  bottom: -2px;
  height: 5px;
  border-radius: 5px 5px 0 0;
  background: var(--color-blanco);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-base) var(--ease-out);
}

.tab[aria-selected='true']::after {
  transform: scaleX(1);
}

.tab__name {
  font-family: var(--font-display);
  font-size: clamp(1.0625rem, 0.55rem + 2.4vw, 2.75rem);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: var(--tracking-tight);
}

.tab__unit {
  font-size: var(--text-xs);
}

.panel {
  padding-top: 2rem;
}

.panel:focus-visible {
  outline-offset: 6px;
}

.panel__summary {
  max-width: 36rem;
  font-size: var(--text-lg);
  font-weight: 600;
}

.lines {
  display: grid;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.line {
  display: grid;
  gap: 0.5rem;
  height: 100%;
  padding: 1.25rem 1.25rem 1.5rem;
  border-radius: 10px;
  background: var(--color-azul-hondo);
  color: inherit;
  text-decoration: none;
  transition: background-color var(--duration-fast) var(--ease-out);
}

.line:hover {
  background: var(--color-noche);
}

.line__name {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  line-height: 1.25;
  font-weight: 700;
}

.line__samples {
  display: grid;
  align-content: start;
  gap: 0.5rem;
  font-size: 0.9375rem;
  line-height: 1.45;
  color: rgb(255 255 255 / 0.88);
}

.line__count {
  margin-top: auto;
  padding-top: 0.5rem;
  font-weight: 700;
  font-size: var(--text-sm);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.panel__all {
  display: inline-flex;
  align-items: center;
  min-height: 3.25rem;
  margin-top: 1.75rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-control);
  background: var(--color-blanco);
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-azul-hondo);
  text-decoration: none;
}

.panel__all:hover {
  background: var(--color-nube);
}

/* Name, examples and count line up across the cards of each row: three per
   row up to 1280px (five don't fit "ciberseguridad" before that), then five. */
@media (width >= 48rem) {
  .lines {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-rows: auto 1fr auto;
    row-gap: 0;
  }

  .lines > li,
  .line {
    display: grid;
    grid-row: span 3;
    grid-template-rows: subgrid;
  }

  .lines > li:nth-child(n + 4) {
    margin-top: 0.75rem;
  }

  .line {
    row-gap: 0.875rem;
  }
}

@media (width >= 80rem) {
  .lines {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .lines > li:nth-child(n + 4) {
    margin-top: 0;
  }
}

/* Phones: equal-width columns left uneven gaps between words of different
   length; the tabs are sized to their names with identical space between. */
@media (width < 40rem) {
  .tabs {
    display: flex;
    justify-content: space-between;
    column-gap: 0.5rem;
  }

  .tab {
    padding-right: 0;
  }

  .tab::after {
    right: 0;
  }

  .tab__unit {
    display: none;
  }
}

@media (width < 24rem) {
  .tab__name {
    font-size: 0.9375rem;
  }
}
</style>

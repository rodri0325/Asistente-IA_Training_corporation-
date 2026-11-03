<script setup lang="ts">
import { ChevronDown, Menu, X, Phone } from '@lucide/vue'
import { primaryNav, contactNav } from '~/data/navigation'
import { modes, services, countOffers, servicePath } from '~/data/services'
import { company } from '~/data/company'

const route = useRoute()
// Lenis loads after the page (motion.client.ts): read it when needed.
const nuxtApp = useNuxtApp()

const sheetOpen = ref(false)
const openMenu = ref<string | null>(null)
const toggle = useTemplateRef<HTMLButtonElement>('toggle')
const nav = useTemplateRef<HTMLElement>('nav')

const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 8)

const isActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`)

watch(() => route.fullPath, () => {
  sheetOpen.value = false
  openMenu.value = null
})

// Freeze the page (and Lenis) while the mobile sheet is open.
const locked = useScrollLock(import.meta.client ? document.documentElement : null)
watch(sheetOpen, (open) => {
  locked.value = open
  if (open) nuxtApp.$lenis?.stop()
  else nuxtApp.$lenis?.start()
})

onClickOutside(nav, () => { openMenu.value = null })

// Sticky bars below the header (service tabs, sector index…) sit at
// --header-offset; keep it equal to the header's real height.
const header = useTemplateRef<HTMLElement>('header')
useResizeObserver(header, ([entry]) => {
  const h = entry?.borderBoxSize?.[0]?.blockSize ?? entry?.contentRect.height
  if (h) document.documentElement.style.setProperty('--header-offset', `${Math.round(h)}px`)
})

// Open on hover for mouse users, with a short delay so passing over the bar
// doesn't flash menus; touch and keyboard keep using click / Enter.
let hoverTimer: ReturnType<typeof setTimeout> | undefined
function hoverOpen(to: string, e: PointerEvent) {
  if (e.pointerType !== 'mouse') return
  clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => { openMenu.value = to }, openMenu.value ? 0 : 120)
}
function hoverClose(e: PointerEvent) {
  if (e.pointerType !== 'mouse') return
  clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => { openMenu.value = null }, 220)
}

onKeyStroke('Escape', () => {
  if (sheetOpen.value) {
    sheetOpen.value = false
    toggle.value?.focus()
  }
  openMenu.value = null
})
</script>

<template>
  <header ref="header" class="header" :class="{ 'header--scrolled': scrolled }">
    <div class="frame header__bar">
      <NuxtLink to="/" class="header__brand" aria-label="Training Corporation, inicio">
        <BrandLogo />
      </NuxtLink>

      <nav ref="nav" class="header__nav" aria-label="Principal">
        <ul class="header__list">
          <li
            v-for="item in primaryNav"
            :key="item.to"
            class="header__item"
            @pointerenter="item.children && hoverOpen(item.to, $event)"
            @pointerleave="item.children && hoverClose($event)"
          >
            <template v-if="item.children">
              <button
                type="button"
                class="header__link"
                :class="{ 'is-active': isActive(item.to) }"
                :aria-expanded="openMenu === item.to"
                :aria-controls="`menu-${item.label}`"
                @click="openMenu = openMenu === item.to ? null : item.to"
              >
                {{ item.label }}
                <ChevronDown class="header__chev" aria-hidden="true" />
              </button>
              <div v-if="item.to === '/portafolio-de-servicios'" v-show="openMenu === item.to" :id="`menu-${item.label}`" class="drop drop--mega">
                <div class="mega">
                  <section v-for="m in modes" :key="m.id" class="mega__col" :aria-labelledby="`mega-${m.id}`">
                    <NuxtLink :id="`mega-${m.id}`" :to="servicePath(m.id)" class="mega__mode" @click="openMenu = null">{{ m.name }}</NuxtLink>
                    <p class="mega__summary">{{ m.summary }}</p>
                    <ul class="mega__lines">
                      <li v-for="l in services" :key="l.slug">
                        <NuxtLink :to="servicePath(m.id, l.slug)" class="mega__line" @click="openMenu = null">
                          <span>{{ l.name }}</span>
                          <span class="mega__n">{{ countOffers(l, m.id) }}</span>
                        </NuxtLink>
                      </li>
                    </ul>
                  </section>
                </div>
                <NuxtLink :to="item.to" class="drop__all link" @click="openMenu = null">Ver todos los servicios</NuxtLink>
              </div>
              <div v-else v-show="openMenu === item.to" :id="`menu-${item.label}`" class="drop">
                <ul class="drop__list">
                  <li v-for="child in item.children" :key="child.to">
                    <NuxtLink :to="child.to" class="drop__link" @click="openMenu = null">
                      <span class="drop__label">{{ child.label }}</span>
                      <span v-if="child.hint" class="drop__hint">{{ child.hint }}</span>
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </template>
            <NuxtLink v-else :to="item.to" class="header__link" :class="{ 'is-active': isActive(item.to) }">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <a :href="company.phones[0].href" class="header__phone">
        <Phone aria-hidden="true" />
        <span>{{ company.phones[0].display }}</span>
      </a>
      <UiButton :to="contactNav.to" class="header__cta">Solicitar cotización</UiButton>

      <button
        ref="toggle"
        type="button"
        class="header__toggle"
        :aria-expanded="sheetOpen"
        aria-controls="menu-movil"
        :aria-label="sheetOpen ? 'Cerrar menú' : 'Abrir menú'"
        @click="sheetOpen = !sheetOpen"
      >
        <X v-if="sheetOpen" aria-hidden="true" />
        <Menu v-else aria-hidden="true" />
      </button>
    </div>

    <Transition name="sheet">
      <div v-show="sheetOpen" id="menu-movil" class="sheet field-azul" data-lenis-prevent>
        <nav class="frame" aria-label="Principal (móvil)">
          <ul class="sheet__list">
            <li v-for="item in [...primaryNav, contactNav]" :key="item.to" class="sheet__item">
              <NuxtLink :to="item.to" class="sheet__link">{{ item.label }}</NuxtLink>
              <ul v-if="item.children" class="sheet__sub">
                <li v-for="child in item.children" :key="child.to">
                  <NuxtLink :to="child.to" class="sheet__sublink">{{ child.label }}</NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
          <div class="sheet__contact">
            <a v-for="p in company.phones" :key="p.href" :href="p.href">{{ p.display }}</a>
            <a :href="`mailto:${company.email}`">{{ company.email }}</a>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--color-blanco);
  transition: box-shadow var(--duration-base) var(--ease-out);
}

.header--scrolled {
  box-shadow: 0 1px 0 var(--color-linea);
}

.header__bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-height: var(--header-h);
}

.header__brand {
  margin-right: auto;
  padding-block: 0.5rem;
}

.header__nav,
.header__cta,
.header__phone {
  display: none;
}

.header__list {
  display: flex;
  gap: 0.25rem;
}

.header__item {
  position: relative;
}

.header__link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  min-height: 2.75rem;
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-control);
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-tinta);
  text-decoration: none;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);
}

.header__link:hover,
.header__link[aria-expanded='true'] {
  background: var(--color-nube);
}

.header__link.is-active {
  color: var(--color-azul);
}

.header__chev {
  width: 1rem;
  height: 1rem;
  transition: transform var(--duration-base) var(--ease-out);
}

.header__link[aria-expanded='true'] .header__chev {
  transform: rotate(180deg);
}

.drop {
  position: absolute;
  top: calc(100% + 0.75rem);
  left: -0.5rem;
  width: min(30rem, 80vw);
  padding: 0.75rem;
  background: var(--color-blanco);
  border: 1px solid var(--color-linea);
  border-radius: 10px;
  box-shadow: 0 24px 48px -24px rgb(11 44 71 / 0.35);
}

.header__nav {
  position: relative;
}

.header__item:has(.drop--mega) {
  position: static;
}

.drop--mega {
  left: 0;
  width: min(56rem, 92vw);
  padding: 1.25rem;
}

.mega {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.mega__col {
  padding: 0.5rem;
}

.mega__mode {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 800;
  letter-spacing: var(--tracking-tight);
  color: var(--color-azul);
  text-decoration: none;
}

.mega__mode:hover {
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.mega__summary {
  margin-block: 0.375rem 0.75rem;
  font-size: var(--text-xs);
  color: var(--color-pizarra);
}

.mega__line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.625rem;
  border-radius: var(--radius-control);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-tinta);
  text-decoration: none;
}

.mega__line:hover {
  background: var(--color-nube);
  color: var(--color-azul);
}

.mega__n {
  flex: none;
  font-size: 0.8125rem;
  color: var(--color-pizarra);
}

.drop__link {
  display: grid;
  gap: 0.125rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-control);
  text-decoration: none;
  color: var(--color-tinta);
}

.drop__link:hover {
  background: var(--color-nube);
}

.drop__label {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
}

.drop__link:hover .drop__label {
  color: var(--color-azul);
}

.drop__hint {
  font-size: var(--text-xs);
  color: var(--color-pizarra);
}

.drop__all {
  display: inline-block;
  margin: 0.5rem 1rem 0.25rem;
  font-size: var(--text-xs);
}

.header__phone {
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--color-tinta);
  text-decoration: none;
  white-space: nowrap;
}

.header__phone svg {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--color-azul);
}

.header__phone:hover span {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.header__toggle {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-control);
  background: var(--color-azul);
  color: var(--color-blanco);
}

.header__toggle svg {
  width: 1.5rem;
  height: 1.5rem;
}

.sheet {
  position: fixed;
  inset: var(--header-offset) 0 0;
  overflow-y: auto;
  padding-block: 1.5rem 3rem;
}

.sheet__item {
  padding-block: 0.75rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.25);
}

.sheet__link {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  letter-spacing: var(--tracking-snug);
  color: inherit;
  text-decoration: none;
}

.sheet__sub {
  margin-top: 0.5rem;
}

.sheet__sublink {
  display: block;
  padding-block: 0.375rem;
  color: inherit;
  text-decoration: none;
}

.sheet__sublink:hover,
.sheet__link:hover {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.sheet__contact {
  display: grid;
  gap: 0.5rem;
  margin-top: 2rem;
  font-weight: 600;
}

.sheet__contact a {
  color: inherit;
  overflow-wrap: anywhere;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out);
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: translateY(-0.75rem);
}

@media (width >= 75rem) {
  .header__nav,
  .header__cta {
    display: flex;
  }

  .header__toggle,
  .sheet {
    display: none !important;
  }
}

@media (width >= 90rem) {
  .header__phone {
    display: inline-flex;
  }
}
</style>

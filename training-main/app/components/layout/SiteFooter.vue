<script setup lang="ts">
import { Phone, Mail, MessageCircle, MapPin, ArrowUp } from '@lucide/vue'
import { company, certifications, agreements } from '~/data/company'
import { primaryNav, secondaryNav, contactNav } from '~/data/navigation'

const year = new Date().getFullYear()
// /contacto already shows the address and phones beside its form.
const route = useRoute()
const showReach = computed(() => route.path !== '/contacto')
// Break the long address only after the @, never inside the domain.
const [emailUser, emailDomain] = company.email.split('@')
// Lenis loads after the page (motion.client.ts): read it when needed.
const nuxtApp = useNuxtApp()

const siteLinks = [...primaryNav, contactNav, ...secondaryNav].filter(
  (item, i, all) => all.findIndex((x) => x.to === item.to) === i,
)

const legal = [
  { label: 'Protección de datos', href: '/docs/Proteccion-datos.pdf' },
  { label: 'Intranet', href: company.intranet },
  { label: 'LinkedIn', href: company.social.linkedin },
  { label: 'Facebook', href: company.social.facebook },
]

function toTop() {
  if (nuxtApp.$lenis) nuxtApp.$lenis.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
  document.getElementById('contenido')?.focus({ preventScroll: true })
}
</script>

<template>
  <footer class="footer field-noche" :class="{ 'footer--compact': !showReach }">
    <div v-if="showReach" class="frame footer__main">
      <section class="visit" aria-labelledby="visit-title">
        <h2 id="visit-title" class="footer__title">Visítenos en Medellín</h2>
        <address class="visit__address">
          <span class="visit__place">{{ company.address.building }}<br>{{ company.address.office }}</span>
          <span>{{ company.address.street }}</span>
          <span class="visit__area">{{ company.address.area }}, {{ company.address.city }}, {{ company.address.region }}</span>
        </address>
        <a :href="company.address.mapUrl" class="visit__map" target="_blank" rel="noopener">
          <MapPin aria-hidden="true" />Cómo llegar<span class="visually-hidden"> (abre Google Maps)</span>
        </a>
      </section>

      <section class="reach" aria-labelledby="reach-title">
        <h2 id="reach-title" class="footer__title">Llame o escriba</h2>
        <ul class="reach__list">
          <li>
            <Phone aria-hidden="true" />
            <span>
              <a :href="company.phones[0].href">{{ company.phones[0].display }}</a>
              <span class="reach__note">Fijo</span>
            </span>
          </li>
          <li>
            <MessageCircle aria-hidden="true" />
            <span>
              <a :href="company.phones[1].href">{{ company.phones[1].display }}</a>
              <span class="reach__note">Móvil y <a :href="company.whatsapp.href" target="_blank" rel="noopener" class="reach__wa">WhatsApp</a></span>
            </span>
          </li>
          <li>
            <Mail aria-hidden="true" />
            <span><a :href="`mailto:${company.email}`" class="reach__email">{{ emailUser }}@<wbr>{{ emailDomain }}</a></span>
          </li>
        </ul>
      </section>
    </div>

    <div class="frame footer__meta">
      <div class="meta__brand">
        <BrandLogo inverse />
        <p class="meta__tagline">{{ company.tagline }}.</p>
      </div>

      <nav class="meta__block" aria-label="Pie de página">
        <h2 class="footer__label">Sitio</h2>
        <ul class="meta__nav">
          <li v-for="item in siteLinks" :key="item.to"><NuxtLink :to="item.to">{{ item.label }}</NuxtLink></li>
        </ul>
      </nav>

      <div class="meta__block">
        <h2 class="footer__label">Certificaciones</h2>
        <ul class="meta__certs">
          <li v-for="c in certifications" :key="c.code">
            <a :href="c.document" target="_blank" rel="noopener"><strong>{{ c.code }}</strong></a>
            <span>{{ c.name }}</span>
          </li>
        </ul>
        <h2 class="footer__label meta__gap">Convenios</h2>
        <p class="meta__muted">{{ agreements.join(' y ') }}</p>
      </div>
    </div>

    <div class="frame">
      <div class="colophon">
        <p>© {{ year }} {{ company.legalName }}</p>
        <ul class="colophon__links">
          <li v-for="l in legal" :key="l.label"><a :href="l.href" target="_blank" rel="noopener">{{ l.label }}</a></li>
        </ul>
        <button type="button" class="colophon__top" @click="toTop">
          <ArrowUp aria-hidden="true" />Volver arriba
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  overflow: hidden;
  padding-top: var(--spacing-section);
  font-size: var(--text-sm);
}

.footer--compact {
  padding-top: 0;
}

.footer--compact .footer__meta {
  border-top: 0;
}

.footer a {
  color: inherit;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.footer__main {
  position: relative;
  display: grid;
  gap: 3rem;
  padding-bottom: var(--spacing-section-sm);
}

.footer__title {
  margin-bottom: 1.25rem;
  font-size: 1rem;
  letter-spacing: 0;
  color: var(--color-cielo);
}

.visit__address {
  display: grid;
  font-family: var(--font-display);
  font-style: normal;
  font-size: var(--text-xl);
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: var(--tracking-snug);
}

.visit__place {
  font-size: var(--text-2xl);
  line-height: var(--text-2xl--line-height);
  font-weight: 800;
  letter-spacing: var(--tracking-tight);
  margin-bottom: 0.5rem;
}

.visit__area {
  color: var(--color-niebla);
}

.visit__map {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.625rem 1.125rem 0.625rem 0.875rem;
  border: 2px solid rgb(255 255 255 / 0.5);
  border-radius: var(--radius-control);
  font-family: var(--font-display);
  font-weight: 700;
  transition: border-color var(--duration-fast) var(--ease-out), background-color var(--duration-fast) var(--ease-out);
}

.footer .visit__map:hover {
  border-color: var(--color-blanco);
  background: rgb(255 255 255 / 0.08);
  text-decoration: none;
}

.visit__map svg {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--color-cielo);
}

.reach__list {
  display: grid;
  gap: 1.25rem;
}

.reach__list > li {
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}

.reach__list svg {
  width: 1.5rem;
  height: 1.5rem;
  margin-top: 0.3rem;
  color: var(--color-cielo);
}

.reach__list > li > span > a {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: var(--tracking-snug);
}

.reach__note {
  display: block;
  color: var(--color-niebla);
}

.footer .reach__wa {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.footer .reach__list .reach__email {
  font-size: var(--text-lg);
  overflow-wrap: anywhere;
}

.footer__meta {
  position: relative;
  display: grid;
  gap: 2.5rem;
  padding-block: 2.5rem;
  border-top: 1px solid rgb(169 198 220 / 0.25);
}

.meta__tagline {
  max-width: 18rem;
  margin-top: 1rem;
  color: var(--color-niebla);
}

.footer__label {
  margin-bottom: 0.75rem;
  font-size: 0.9375rem;
  letter-spacing: 0;
  color: var(--color-blanco);
}

.meta__gap {
  margin-top: 1.5rem;
}

.meta__nav {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.375rem 1.5rem;
  color: var(--color-niebla);
}

.meta__nav a:hover {
  color: var(--color-blanco);
}

.meta__certs {
  display: grid;
  gap: 0.5rem;
}

.meta__certs li {
  display: grid;
}

.meta__certs span,
.meta__muted {
  color: var(--color-niebla);
}

.colophon {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 2rem;
  padding-block: 1.5rem 2rem;
  border-top: 1px solid rgb(169 198 220 / 0.25);
  color: var(--color-niebla);
}

.colophon__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin-right: auto;
}

.colophon__top {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding-inline: 0.75rem;
  /* The padding is hit area, not indent: the text lines up with the column. */
  margin-left: -0.75rem;
  border-radius: var(--radius-control);
  font-weight: 700;
  color: var(--color-blanco);
  cursor: pointer;
}

.colophon__top:hover {
  background: rgb(255 255 255 / 0.08);
}

.colophon__top svg {
  width: 1.125rem;
  height: 1.125rem;
  transition: transform var(--duration-base) var(--ease-out);
}

.colophon__top:hover svg {
  transform: translateY(-3px);
}

@media (width >= 48rem) {
  .footer__main {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    column-gap: var(--spacing-gutter);
  }

  .footer__meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: var(--spacing-gutter);
  }
}

@media (width >= 64rem) {
  .footer__meta {
    grid-template-columns: minmax(0, 4fr) minmax(0, 4fr) minmax(0, 4fr);
  }

  .visit__place {
    font-size: var(--text-3xl);
    line-height: var(--text-3xl--line-height);
  }
}
</style>

<script setup lang="ts">
import { clientsIn } from '~/data/clients'
import { presence } from '~/data/company'

/**
 * Opening: the logo's ring as a certification seal made of the standards the
 * company works with, with the statement inside it. The ring opens toward the
 * verifiable facts. The page's single orchestrated motion: the ring draws round
 * the statement and the standards are "stamped" one by one. The statement itself
 * is painted at once (it is the page's largest element, what Google times).
 */
const topNorms = ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 55001', 'ISO/IEC 27001', 'ISO/IEC 17025']
const bottomNorms = ['CREG 015', 'RETIE', 'RETILAP', 'Decreto 1072', 'MIPG', 'GTC-ISO 19011']
const utilities = clientsIn('energia').length

const root = useTemplateRef<HTMLElement>('root')

useMotion(root, ({ gsap }) => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo('.seal__ring', { attr: { 'stroke-dasharray': '0 100' } }, { attr: { 'stroke-dasharray': '100 0' }, duration: 1.5, ease: 'power2.inOut' })
    .fromTo('.seal__dot', { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 1.2)
    .fromTo('.seal__norm', { opacity: 0 }, { opacity: 1, duration: 0.25, stagger: 0.07, ease: 'none' }, 0.5)
    .fromTo('.hero__line', { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08 }, 0.3)
    .fromTo('.hero__fact', { x: -16, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 1.2)
})
</script>

<template>
  <section ref="root" class="hero" aria-labelledby="hero-title">
    <div class="frame hero__grid">
      <div class="hero__seal">
        <BrandSeal :top="topNorms" :bottom="bottomNorms" class="hero__ring" />
        <div class="hero__inner">
          <h1 id="hero-title" class="hero__title">
            Auditoría, formación y consultoría para organizaciones que trabajan bajo norma
          </h1>
        </div>
      </div>

      <div class="hero__side">
        <p class="hero__lede hero__line">
          Sistemas de gestión ISO y regulación del sector eléctrico colombiano. Trabajamos desde Medellín.
        </p>
        <div class="hero__actions hero__line">
          <UiButton to="/contacto">Solicitar una cotización</UiButton>
          <UiButton to="/portafolio-de-servicios" variant="outline">Ver los servicios</UiButton>
        </div>
        <ul class="hero__facts" aria-label="Respaldo">
          <li class="hero__fact"><a href="#certificaciones">Certificados en ISO 9001:2015 e ISO 45001:2018</a></li>
          <li class="hero__fact">Miembro corporativo del Institute of Asset Management</li>
          <li class="hero__fact"><a href="#sector-title">{{ utilities }} empresas de energía entre nuestros clientes</a></li>
          <li class="hero__fact">Servicios en {{ presence.departments.length }} departamentos, {{ presence.countries.join(' y ') }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-block: clamp(1rem, 0.5rem + 2vw, 2.5rem) clamp(3.5rem, 2rem + 4vw, 6rem);
  overflow: hidden;
}

.hero__grid {
  display: grid;
  gap: 1.5rem;
}

/* The seal is a square; the title sits in the square inscribed in the ring. */
.hero__seal {
  position: relative;
  aspect-ratio: 1;
  width: min(100%, 32rem);
  justify-self: center;
  container-type: inline-size;
}

.hero__ring {
  position: absolute;
  inset: 0;
}

/* Centred on the ring's centre: a centred block follows the circle's shape,
   a left-aligned one looks pushed against the ring. */
.hero__inner {
  position: absolute;
  inset: 20% 19%;
  display: grid;
  place-content: center;
  text-align: center;
}

/* Sized to the seal, not the viewport, so it fills the ring on every screen. */
.hero__title {
  font-family: var(--font-display);
  font-size: 6.4cqi;
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: var(--tracking-tight);
  color: var(--color-tinta);
  text-wrap: balance;
  hyphens: manual;
}

.hero__side {
  display: grid;
  gap: 2rem;
  align-content: center;
}

.hero__lede {
  font-size: var(--text-lg);
  line-height: var(--text-lg--line-height);
  color: var(--color-pizarra);
  max-width: 28rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hero__facts {
  display: grid;
  gap: 0.875rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--color-linea);
  font-weight: 600;
}

.hero__fact {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

/* The seal's satellite dot as the list marker (an open ring this small reads as a spinner). */
.hero__fact::before {
  content: '';
  flex: none;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: var(--radius-full);
  background: var(--color-azul-vivo);
  transform: translateY(-0.1em);
}

.hero__fact a {
  color: var(--color-azul);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

@media (width < 30rem) {
  .hero__actions > * {
    flex: 1 1 100%;
  }
}

@media (width >= 64rem) {
  .hero__grid {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    align-items: center;
    column-gap: clamp(2rem, 4vw, 4.5rem);
  }

  .hero__seal {
    width: 100%;
    max-width: 44rem;
    justify-self: start;
    margin-left: -2%;
  }
}
</style>

<style>
/* Start state of the load sequence; only when motion is allowed (app.vue). */
html.motion .hero__line,
html.motion .hero__fact,
html.motion .seal__norm {
  opacity: 0;
  /* Safety net: if scripts are slow or fail, show everything anyway. */
  animation: hero-fallback 0.01s 2.5s forwards;
}

@keyframes hero-fallback {
  to { opacity: 1; }
}
</style>

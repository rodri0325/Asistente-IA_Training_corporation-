import { modes, servicePath } from './services'

export interface NavItem {
  label: string
  to: string
  /** One line shown in the desktop dropdown. */
  hint?: string
  children?: NavItem[]
}

/** Primary navigation. Paths keep the current WordPress URLs where a page already ranks. */
export const primaryNav: NavItem[] = [
  {
    label: 'Servicios',
    to: '/portafolio-de-servicios',
    // The three business units; the desktop menu expands each into its five lines.
    children: modes.map((m) => ({ label: m.name, to: servicePath(m.id), hint: m.summary })),
  },
  { label: 'Diplomados', to: '/cursos-y-formaciones' },
  { label: 'Clientes', to: '/clientes' },
  {
    label: 'Empresa',
    to: '/empresa',
    children: [
      { label: 'Nuestra empresa', to: '/empresa', hint: 'Propósito, presencia, valores y principios' },
      { label: 'Nuestro equipo', to: '/empresa/equipo', hint: 'Las personas detrás de cada servicio' },
      { label: 'Sistema de Gestión Integrado', to: '/empresa/sistema-de-gestion-integrado', hint: 'Certificados, licencia SST y boletines' },
    ],
  },
  { label: 'Actualidad', to: '/actualidad' },
]

export const contactNav: NavItem = { label: 'Contacto', to: '/contacto' }

export const secondaryNav: NavItem[] = [
  { label: 'Contratistas y proveedores', to: '/contratistas' },
  { label: 'Sistema de Gestión Integrado', to: '/empresa/sistema-de-gestion-integrado' },
]

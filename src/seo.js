// Título, descripción y ruta de cada página. Los usan el pre-renderizado (vite.config.js) y el cambio de página en el navegador.
import es from './languages/es/global.json' with { type: 'json' }

export const DOMINIO_POR_DEFECTO = 'https://soltherra.co'

// Los textos en español viven en languages/es/global.json (sección "seo"); aquí solo la ruta de cada página.
// El pre-renderizado (vite.config.js) y el sitemap usan el español; el navegador cambia al idioma elegido (ver aplicarSeo).
const RUTAS = {
  inicio: '/',
  servicios: '/servicios',
  'como-funciona': '/como-funciona',
  trabajos: '/trabajos',
  contacto: '/contacto',
  privacidad: '/privacidad',
}

export const SEO = Object.fromEntries(
  Object.entries(RUTAS).map(([pagina, ruta]) => [
    pagina,
    { ruta, titulo: es.seo[pagina].title, descripcion: es.seo[pagina].description },
  ]),
)

/** Actualiza descripción, canonical y vista previa para social al cambiar de página o de idioma sin recargar. */
export function aplicarSeo(pagina, textos = SEO[pagina]) {
  const { titulo, descripcion } = textos
  const { ruta } = SEO[pagina]
  const canonical = document.querySelector('link[rel="canonical"]')
  const url = canonical ? new URL(ruta, canonical.href).href : null
  const poner = (selector, valor) => document.querySelector(selector)?.setAttribute('content', valor)
  poner('meta[name="title"]', titulo)
  poner('meta[name="description"]', descripcion)
  poner('meta[property="og:title"]', titulo)
  poner('meta[property="og:description"]', descripcion)
  poner('meta[name="twitter:title"]', titulo)
  poner('meta[name="twitter:description"]', descripcion)
  if (url) {
    canonical.setAttribute('href', url)
    poner('meta[property="og:url"]', url)
    poner('meta[name="twitter:url"]', url)
  }
}

// Datos estructurados propios de cada página (el LocalBusiness global va en index.html y llega a todas).
// FAQPage sale de las mismas preguntas visibles en la guía (guide.<página>.faq), sin el formato de enlaces.

// Páginas que muestran la guía (texto + preguntas frecuentes, Guia.jsx). Vacía mientras el cliente revisa los textos;
// para activarla en una página, añade su nombre aquí (ej. 'inicio'): aparece la sección y su JSON-LD FAQPage.
export const GUIAS_ACTIVAS = []
const SIN_ENLACES = (texto) => texto.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

const SERVICIOS = [
  ['fotovoltaico', 'Instalación de paneles solares fotovoltaicos', 'Sistema solar fotovoltaico'],
  ['termico', 'Calentadores solares y sistemas solares térmicos', 'Sistema solar térmico'],
  ['piscina', 'Climatización solar de piscinas y jacuzzis', 'Climatización solar de piscinas'],
  ['carga-ev', 'Puntos de carga para vehículos eléctricos', 'Instalación de cargadores para vehículos eléctricos'],
  ['mantenimiento', 'Mantenimiento preventivo y correctivo de sistemas solares', 'Mantenimiento de sistemas solares'],
  ['tramites', 'Trámites ante el operador de red y beneficios tributarios', 'Gestión de trámites de energía solar'],
]

/** Lista de objetos JSON-LD para la página (vacía si no tiene). `base` es el dominio sin barra final. */
export function datosEstructurados(pagina, base) {
  const datos = []
  const empresa = { '@id': `${base}/#empresa` }
  if (pagina === 'servicios') {
    datos.push({
      '@context': 'https://schema.org',
      '@graph': SERVICIOS.map(([id, name, serviceType]) => ({
        '@type': 'Service',
        '@id': `${base}/servicios#${id}`,
        name,
        serviceType,
        provider: empresa,
        areaServed: { '@type': 'City', name: 'Cali' },
        url: `${base}/servicios#${id}`,
      })),
    })
  }
  const faq = GUIAS_ACTIVAS.includes(pagina) ? es.guide?.[pagina]?.faq : null
  if (faq?.length) {
    datos.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: SIN_ENLACES(a) } })),
    })
  }
  return datos
}

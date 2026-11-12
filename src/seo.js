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

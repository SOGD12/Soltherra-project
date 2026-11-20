// Rutas del sitio por idioma. No depende de React ni del navegador: lo usan el navegador (ruta.js), el
// pre-renderizado (entry-server.jsx) y vite.config.js (archivos, sitemap, hreflang y .htaccess).
//
// Español en la raíz (/servicios) e inglés bajo /en (/en/services). Cada idioma tiene su propia dirección:
// así los buscadores pueden indexar los dos y enlazarlos entre sí con hreflang.
export const IDIOMAS = ['es', 'en']
export const PAGINAS = ['inicio', 'servicios', 'como-funciona', 'trabajos', 'contacto', 'privacidad', 'terminos']

const SLUGS = {
  es: { inicio: '', servicios: 'servicios', 'como-funciona': 'como-funciona', trabajos: 'trabajos', contacto: 'contacto', privacidad: 'privacidad', terminos: 'terminos' },
  en: { inicio: '', servicios: 'services', 'como-funciona': 'how-it-works', trabajos: 'projects', contacto: 'contact', privacidad: 'privacy', terminos: 'terms' },
}

// Etiqueta hreflang de cada idioma y su equivalente de og:locale.
export const HREFLANG = { es: 'es-CO', en: 'en' }
export const LOCALE_OG = { es: 'es_CO', en: 'en_US' }

/** Última parte de la ruta de la página en ese idioma ('' en el inicio). */
export const slugDe = (pagina, idioma = 'es') => SLUGS[idioma][pagina]

/** Ruta de una página: rutaDe('servicios', 'en') -> '/en/services'. El inicio en inglés es '/en/'. */
export function rutaDe(pagina, idioma = 'es') {
  const slug = SLUGS[idioma][pagina]
  if (idioma === 'en') return slug ? `/en/${slug}` : '/en/'
  return slug ? `/${slug}` : '/'
}

const sinBarras = (ruta) => ruta.replace(/^\/+|\/+$/g, '')

/** { pagina, idioma } de una dirección, o null si no es una página del sitio. */
export function resolverRuta(pathname) {
  let tramo = sinBarras(pathname)
  const idioma = tramo === 'en' || tramo.startsWith('en/') ? 'en' : 'es'
  if (idioma === 'en') tramo = tramo.slice(3)
  if (idioma === 'es' && tramo === 'home') return { pagina: 'inicio', idioma }
  const pagina = PAGINAS.find((p) => SLUGS[idioma][p] === tramo)
  return pagina ? { pagina, idioma } : null
}

/** Idioma de una dirección. Una que no existe se muestra siempre en español: es la página 404.html, pre-renderizada en español. */
export const idiomaDeRuta = (pathname) => resolverRuta(pathname)?.idioma ?? 'es'

/** Pasa un enlace interno del sitio al idioma pedido: localizar('/servicios#termico', 'en') -> '/en/services#termico'.
 *  Lo que no sea una página del sitio (tel:, https://, imágenes...) se devuelve igual. */
export function localizar(href, idioma) {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const [, ruta, resto = ''] = href.match(/^([^#?]*)([#?].*)?$/)
  const destino = resolverRuta(ruta)
  return destino ? rutaDe(destino.pagina, idioma) + resto : href
}

/** Las versiones de una página en todos los idiomas: [{ idioma, hreflang, ruta }]. */
export const versiones = (pagina) => IDIOMAS.map((idioma) => ({ idioma, hreflang: HREFLANG[idioma], ruta: rutaDe(pagina, idioma) }))

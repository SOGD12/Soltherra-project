// Título, descripción, ruta y datos estructurados de cada página, en español e inglés. Los usan el pre-renderizado
// (vite.config.js) y el cambio de página en el navegador (aplicarSeo).
import es from './languages/es/global.json' with { type: 'json' }
import en from './languages/en/global.json' with { type: 'json' }
import { TEL, TEL2, CORREO, INSTAGRAM, FACEBOOK } from './data/contenido.js'
import { HREFLANG, LOCALE_OG, PAGINAS, rutaDe, versiones } from './rutas.js'

export const DOMINIO_POR_DEFECTO = 'https://soltherra.co'

const TEXTOS = { es, en }

// Los textos viven en languages/<idioma>/global.json (sección "seo"); las rutas, en rutas.js.
// SEO es el español (sitemap, llms.txt y el HTML de la raíz); seoDe(pagina, idioma) sirve cualquier idioma.
export const seoDe = (pagina, idioma = 'es') => ({
  ruta: rutaDe(pagina, idioma),
  titulo: TEXTOS[idioma].seo[pagina].title,
  descripcion: TEXTOS[idioma].seo[pagina].description,
})

export const SEO = Object.fromEntries(PAGINAS.map((pagina) => [pagina, seoDe(pagina, 'es')]))

/** Texto alternativo de la imagen que se muestra al compartir el sitio (og:image:alt), en el idioma pedido. */
export const altSocial = (idioma) => TEXTOS[idioma].seo['social-alt']

/** Página 404: título en el idioma pedido (la entrega el servidor con estado 404 y sin indexar). */
export const tituloNoEncontrada = (idioma) => TEXTOS[idioma].seo.noencontrada.title

/** Actualiza título, descripción, canonical, hreflang y vista previa para social al cambiar de página o de idioma sin recargar. */
export function aplicarSeo(pagina, idioma) {
  if (!SEO[pagina]) {
    document.title = tituloNoEncontrada(idioma)
    return
  }
  const { titulo, descripcion, ruta } = seoDe(pagina, idioma)
  const canonical = document.querySelector('link[rel="canonical"]')
  const url = canonical ? new URL(ruta, canonical.href).href : null
  const poner = (selector, valor) => document.querySelector(selector)?.setAttribute('content', valor)
  document.title = titulo
  poner('meta[name="title"]', titulo)
  poner('meta[name="description"]', descripcion)
  poner('meta[property="og:title"]', titulo)
  poner('meta[property="og:description"]', descripcion)
  poner('meta[name="twitter:title"]', titulo)
  poner('meta[name="twitter:description"]', descripcion)
  poner('meta[property="og:locale"]', LOCALE_OG[idioma])
  poner('meta[property="og:image:alt"]', altSocial(idioma))
  poner('meta[name="twitter:image:alt"]', altSocial(idioma))
  if (url) {
    canonical.setAttribute('href', url)
    poner('meta[property="og:url"]', url)
    poner('meta[name="twitter:url"]', url)
    // Las versiones de la página en cada idioma (hreflang) y x-default (el español).
    for (const v of versiones(pagina)) {
      document.querySelector(`link[rel="alternate"][hreflang="${v.hreflang}"]`)?.setAttribute('href', new URL(v.ruta, canonical.href).href)
    }
    document.querySelector('link[rel="alternate"][hreflang="x-default"]')?.setAttribute('href', new URL(rutaDe(pagina, 'es'), canonical.href).href)
  }
}

// Datos estructurados. El de la empresa (LocalBusiness + WebSite) va en todas las páginas y el de cada página
// (WebPage, migas, servicios) se suma a él. FAQPage sale de las mismas preguntas visibles en la guía (guide.<página>.faq).

// Páginas que muestran la guía (texto + preguntas frecuentes, Guia.jsx). Vacía mientras el cliente revisa los textos;
// para activarla en una página, añade su nombre aquí (ej. 'inicio'): aparece la sección y su JSON-LD FAQPage.
export const GUIAS_ACTIVAS = []
const SIN_ENLACES = (texto) => texto.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

// Soltherra tiene sede en Cali pero instala en todo el país: la zona de servicio es Colombia, en la empresa y en cada servicio.
const AREA_SERVIDA = { '@type': 'Country', name: 'Colombia' }
const e164 = (numero) => `+${numero.replace(/\D/g, '')}`

const EMPRESA = {
  es: {
    descripcion:
      'Diseño, instalación y mantenimiento de sistemas solares fotovoltaicos y solares térmicos para hogares, empresas e instituciones. Con sede en Cali, instalamos en todo Colombia.',
    sabe: ['Energía solar fotovoltaica', 'Energía solar térmica', 'Climatización solar de piscinas', 'Carga de vehículos eléctricos'],
    alternos: ['Soltherra S.A.S.', 'Soltherra Energía Solar'],
  },
  en: {
    descripcion:
      'Design, installation and maintenance of photovoltaic and solar thermal systems for homes, businesses and institutions. Based in Cali, we install across Colombia.',
    sabe: ['Photovoltaic solar energy', 'Solar thermal energy', 'Solar pool heating', 'Electric vehicle charging'],
    alternos: ['Soltherra S.A.S.', 'Soltherra Solar Energy'],
  },
}

// Enlace a la ficha de Google Maps: el segundo número del identificador del mapa (contenido.js, MAPA) en decimal.
const HAS_MAP = `https://www.google.com/maps?cid=${BigInt('0x2c183a56456f74e5')}`

/** Empresa y sitio web (@graph) para todas las páginas de un idioma. `base` es el dominio sin barra final. */
export function datosEmpresa(base, idioma = 'es') {
  const { descripcion, sabe, alternos } = EMPRESA[idioma]
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HomeAndConstructionBusiness',
        '@id': `${base}/#empresa`,
        name: 'Soltherra',
        legalName: 'Soltherra S.A.S.',
        alternateName: ['Soltherra S.A.S.', 'Soltherra Energía Sostenible'],
        url: `${base}/`,
        logo: { '@type': 'ImageObject', url: `${base}/icon-192.png`, width: 192, height: 192 },
        image: `${base}/og.webp`,
        description: descripcion,
        telephone: e164(TEL),
        email: CORREO,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Calle 28 # 86-70',
          addressLocality: 'Cali',
          addressRegion: 'Valle del Cauca',
          addressCountry: 'CO',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 3.37817, longitude: -76.52387 },
        hasMap: HAS_MAP,
        areaServed: AREA_SERVIDA,
        contactPoint: [
          { '@type': 'ContactPoint', telephone: e164(TEL), contactType: 'sales', availableLanguage: ['es', 'en'] },
          { '@type': 'ContactPoint', telephone: e164(TEL2), contactType: 'customer service', availableLanguage: 'es' },
        ],
        knowsAbout: sabe,
        sameAs: [INSTAGRAM, FACEBOOK],
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#web`,
        url: `${base}/`,
        name: 'Soltherra',
        alternateName: alternos,
        inLanguage: HREFLANG[idioma],
        publisher: { '@id': `${base}/#empresa` },
      },
    ],
  }
}

// [ancla del bloque en /servicios, clave en global.json "services", tipo de servicio en cada idioma]
const SERVICIOS = [
  ['fotovoltaico', 'photovoltaic', { es: 'Sistema solar fotovoltaico', en: 'Photovoltaic solar system' }],
  ['termico', 'thermal', { es: 'Sistema solar térmico', en: 'Solar thermal system' }],
  ['piscina', 'pool', { es: 'Climatización solar de piscinas', en: 'Solar pool heating' }],
  ['carga-ev', 'ev', { es: 'Instalación de cargadores para vehículos eléctricos', en: 'Electric vehicle charger installation' }],
  ['mantenimiento', 'maintenance', { es: 'Mantenimiento de sistemas solares', en: 'Solar system maintenance' }],
  ['tramites', 'procedures', { es: 'Gestión de trámites de energía solar', en: 'Solar energy permit management' }],
]

// Texto de cada página en las migas: el del menú, o el del pie para las legales.
const CLAVE_MIGA = {
  inicio: 'menu.home',
  servicios: 'menu.services',
  'como-funciona': 'menu.how-it-works',
  trabajos: 'menu.works',
  contacto: 'menu.contact',
  privacidad: 'footer.privacy',
  terminos: 'footer.terms',
}
const texto = (idioma, clave) => clave.split('.').reduce((o, k) => o[k], TEXTOS[idioma])

/** Lista de objetos JSON-LD propios de la página (sin la empresa, ver datosEmpresa). `base` es el dominio sin barra final. */
export function datosEstructurados(pagina, base, idioma = 'es') {
  const textos = TEXTOS[idioma]
  const datos = []
  const empresa = { '@id': `${base}/#empresa` }
  const urlPagina = `${base}${rutaDe(pagina, idioma)}`
  const { titulo, descripcion } = seoDe(pagina, idioma)
  const web = {
    '@context': 'https://schema.org',
    '@type': pagina === 'contacto' ? 'ContactPage' : 'WebPage',
    '@id': `${urlPagina}#pagina`,
    url: urlPagina,
    name: titulo,
    description: descripcion,
    inLanguage: HREFLANG[idioma],
    isPartOf: { '@id': `${base}/#web` },
    about: empresa,
  }
  if (pagina !== 'inicio') web.breadcrumb = { '@id': `${urlPagina}#migas` }
  datos.push(web)

  if (pagina !== 'inicio') {
    datos.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${urlPagina}#migas`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: texto(idioma, CLAVE_MIGA.inicio), item: `${base}${rutaDe('inicio', idioma)}` },
        { '@type': 'ListItem', position: 2, name: texto(idioma, CLAVE_MIGA[pagina]), item: urlPagina },
      ],
    })
  }

  // Los nombres y descripciones salen de los mismos textos que se ven en /servicios, para que no se desfasen.
  if (pagina === 'servicios') {
    datos.push({
      '@context': 'https://schema.org',
      '@graph': SERVICIOS.map(([id, clave, serviceType]) => ({
        '@type': 'Service',
        '@id': `${urlPagina}#${id}`,
        name: textos.services[clave].title,
        description: textos.services[clave].text,
        serviceType: serviceType[idioma],
        provider: empresa,
        areaServed: AREA_SERVIDA,
        url: `${urlPagina}#${id}`,
      })),
    })
  }

  const faq = GUIAS_ACTIVAS.includes(pagina) ? textos.guide?.[pagina]?.faq : null
  if (faq?.length) {
    datos.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: SIN_ENLACES(a) } })),
    })
  }
  return datos
}

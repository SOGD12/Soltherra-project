// Título, descripción y ruta de cada página. Los usan el pre-renderizado (vite.config.js) y el cambio de página en el navegador.
export const DOMINIO_POR_DEFECTO = 'https://soltherra.vercel.app'

export const SEO = {
  inicio: {
    ruta: '/',
    titulo: 'Soltherra | Energía solar fotovoltaica y térmica en Cali',
    descripcion:
      'Soltherra S.A.S. en Cali: diseño, instalación y mantenimiento de sistemas solares fotovoltaicos y solares térmicos para hogares, empresas e instituciones.',
  },
  servicios: {
    ruta: '/servicios',
    titulo: 'Servicios solares en Cali: fotovoltaico, térmico y piscinas | Soltherra',
    descripcion:
      'Paneles solares, calentadores solares, climatización de piscinas, cargadores para vehículos eléctricos, mantenimiento y trámites ante el operador de red en Cali.',
  },
  'como-funciona': {
    ruta: '/como-funciona',
    titulo: 'Cómo funciona un sistema solar y cómo trabajamos | Soltherra',
    descripcion:
      'Del sol a tu casa: así funciona un sistema solar y cuál es el proceso de Soltherra, desde la visita técnica y la ingeniería hasta la instalación y puesta en marcha.',
  },
  trabajos: {
    ruta: '/trabajos',
    titulo: 'Nuestros trabajos: instalaciones solares reales | Soltherra',
    descripcion:
      'Obras reales de Soltherra en Cali y el Valle del Cauca: paneles fotovoltaicos, colectores solares térmicos, piscinas, cargadores de vehículos eléctricos y mantenimiento.',
  },
  contacto: {
    ruta: '/contacto',
    titulo: 'Contacto y cotización de energía solar en Cali | Soltherra',
    descripcion:
      'Escríbenos por WhatsApp al +57 313 813 0046 o visítanos en la Calle 28 N° 86-70, Cali, para cotizar tu sistema solar.',
  },
}

/** Actualiza título, descripción, canonical y vista previa para social al cambiar de página sin recargar. */
export function aplicarSeo(pagina) {
  const { titulo, descripcion, ruta } = SEO[pagina]
  const canonical = document.querySelector('link[rel="canonical"]')
  const url = canonical ? new URL(ruta, canonical.href).href : null
  document.title = titulo
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

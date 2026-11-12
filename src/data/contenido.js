export const TEL = '+57 313 813 0046'
export const TEL2 = '+57 312 878 7181'
export const WA ='https://wa.me/573138130046'
export const CORREO = 'soltherra23@gmail.com'
export const DIRECCION = 'Calle 28 N° 86 - 70, Cali'
/** Enlace de WhatsApp con el texto ya escrito (el texto sale de global.json en el idioma elegido). */
export const wa = (texto) => `${WA}?text=${encodeURIComponent(texto)}`
export const MAPA =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248.93033764012515!2d-76.5238692265609!3d3.3781739830128097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a11313ec31c5%3A0x2c183a56456f74e5!2sCl.%2028%20%2386-70%2C%20Comuna%2017%2C%20Cali%2C%20Valle%20del%20Cauca!5e0!3m2!1ses-419!2sco!4v1770853641815!5m2!1ses-419!2sco'
/** Mapa en el idioma elegido: el parámetro 1s<idioma> del embed cambia los textos de la interfaz de Google Maps. */
export const mapa = (idioma) => (idioma === 'en' ? MAPA.replaceAll('1ses-419', '1sen') : MAPA)
export const INSTAGRAM = 'https://www.instagram.com/soltherra_energiasostenible/'
export const FACEBOOK = 'https://web.facebook.com/profile.php?id=61587216064854'
/** Arma el mensaje de WhatsApp del formulario: solo usa lo que la persona escribió (ISO/IEC 27701, minimización de datos).
 *  `base` es el texto de contact.whatsapp en el idioma elegido, con {{name}} y {{service}}. */
export const mensajeContacto = ({ base, nombre, servicio, mensaje }) => {
  const limpiar = (texto) => texto.replace(/\s+/g, ' ').trim()
  const extra = limpiar(mensaje)
  return base.replace('{{name}}', limpiar(nombre)).replace('{{service}}', servicio) + (extra ? ` ${extra}` : '')
}

// Los textos de todo el sitio están en src/languages/<idioma>/global.json. Aquí solo quedan lo que no se traduce:
// rutas, iconos, imágenes y las claves que enlazan cada elemento con su texto.

// [clave en menu.*, ruta]
export const nav = [
  ['home', '/'],
  ['services', '/servicios'],
  ['how-it-works', '/como-funciona'],
  ['works', '/trabajos'],
  ['contact', '/contacto'],
]

// Iconos de engineering.items (mismo orden)
export const gestiones = ['engineering', 'description', 'assignment_turned_in', 'receipt_long']

// Iconos de how-it-works.process.steps (mismo orden)
export const pasos = ['engineering', 'description', 'solar_power', 'monitoring', 'build']

// Historia de la escena 3D: iconos de how-it-works.tour.steps (mismo orden); cada paso ocupa una parte del recorrido de scroll.
export const historia = ['light_mode', 'solar_power', 'electrical_services', 'home']

// Iconos de works.benefits.items (mismo orden)
export const beneficios = ['trending_down', 'eco', 'verified_user', 'tune', 'savings']

// clave en home.solutions.items, clase, enlace e imagen (soluciones.json)
export const soluciones = [
  { clave: 'photovoltaic', clase: 'bento__tarjeta--a', href: '/servicios#servicios', imagen: 'fotovoltaicos' },
  { clave: 'thermal', clase: 'bento__tarjeta--b', href: '/servicios#termico', imagen: 'termicos' },
  { clave: 'maintenance', clase: 'bento__tarjeta--c', href: '/servicios#mantenimiento', imagen: 'mantenimiento' },
  { clave: 'procedures', clase: 'bento__tarjeta--d', href: '/servicios#tramites', imagen: 'tramites' },
  { clave: 'ev', clase: 'bento__tarjeta--e', href: '/servicios#carga-ev', imagen: 'carga-ev' },
]

// [clave de categoría (también en works.categories.*), icono]
export const categorias = [
  ['fotovoltaico', 'solar_power'],
  ['termico', 'thermostat'],
  ['piscina', 'pool'],
  ['mantenimiento', 'build'],
  ['ev', 'ev_station'],
]

// Infografías de equipos (página Cómo funciona), agrupadas en Fotovoltaico y Térmico.
// Títulos y descripciones en how-it-works.infographics.items.<clave>.
// `foto` es la versión en español; `en` es la misma infografía en inglés (se muestra al elegir inglés).
export const infografias = [
  { clave: 'panel', grupo: 'photovoltaic', foto: '/img/infografia-panel-solar.webp?v=2', ancho: 941, alto: 1015, en: { foto: '/img/infografia-panel-solar-en.webp?v=2', ancho: 949, alto: 1020 } },
  { clave: 'hybrid', grupo: 'photovoltaic', foto_completa: true, foto: '/img/infografia-sistema-hibrido.webp', ancho: 1448, alto: 1086, en: { foto: '/img/infografia-sistema-hibrido-en.webp', ancho: 1500, alto: 1125 } },
  { clave: 'pressurized', grupo: 'thermal', foto: '/img/infografia-calentador-presurizado.webp?v=2', ancho: 880, alto: 860, en: { foto: '/img/infografia-calentador-presurizado-en.webp', ancho: 1500, alto: 1466 } },
  { clave: 'butterfly', grupo: 'thermal', foto: '/img/infografia-colector-mariposa.webp?v=2', ancho: 1070, alto: 1240, en: { foto: '/img/infografia-colector-mariposa-en.webp?v=2', ancho: 883, alto: 1020 } },
]

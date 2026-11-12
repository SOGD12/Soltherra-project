// Google Tag Manager (Google Analytics 4 se configura dentro del contenedor, en tagmanager.google.com).
// Solo se carga si la persona acepta las cookies de medición (Ley 1581 de 2012); sin respuesta o con
// "Rechazar" no se descarga nada de Google. La respuesta se guarda en este navegador (localStorage).
// Las páginas vistas al navegar sin recargar las registra GA4 con su "medición mejorada"
// (cambios del historial del navegador), que viene activada por defecto.

const GTM_ID = 'GTM-WJ62STLN'
const CLAVE = 'consentimiento-medicion'
export const EVENTO_ABRIR = 'abrir-aviso-cookies'
const EVENTO_CAMBIO = 'consentimiento-cambio'

// Respaldo si el navegador no deja usar localStorage (modo privado estricto): vale solo para esta visita.
let enMemoria = null

/** 'si', 'no' o null (aún no ha respondido). */
export function leerConsentimiento() {
  try {
    const valor = localStorage.getItem(CLAVE)
    return valor === 'si' || valor === 'no' ? valor : enMemoria
  } catch {
    return enMemoria
  }
}

/** Para useSyncExternalStore: avisa cuando cambia la respuesta (en esta pestaña o en otra). */
export function suscribirConsentimiento(aviso) {
  window.addEventListener(EVENTO_CAMBIO, aviso)
  window.addEventListener('storage', aviso)
  return () => {
    window.removeEventListener(EVENTO_CAMBIO, aviso)
    window.removeEventListener('storage', aviso)
  }
}

let cargado = false

/** Carga el contenedor de GTM (fragmento oficial, sin script en línea). Solo en producción. */
export function cargarGTM() {
  if (cargado || !import.meta.env.PROD) return
  cargado = true
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(script)
}

// Borra las cookies de Google Analytics (_ga, _ga_XXXX, _gid) del dominio y sus subdominios.
function borrarCookiesGA() {
  const dominios = ['', location.hostname, `.${location.hostname.replace(/^www\./, '')}`]
  document.cookie.split(';').forEach((c) => {
    const nombre = c.split('=')[0].trim()
    if (!/^_ga|^_gid$|^_gat/.test(nombre)) return
    dominios.forEach((d) => {
      document.cookie = `${nombre}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ''}`
    })
  })
}

/** Guarda la respuesta. Al aceptar carga GTM; al rechazar después de haber aceptado, borra sus
 *  cookies y recarga para que el script de Google deje de correr en esta pestaña. */
export function guardarConsentimiento(valor) {
  const antes = leerConsentimiento()
  enMemoria = valor
  try {
    localStorage.setItem(CLAVE, valor)
  } catch {
    // Sin almacenamiento: queda en enMemoria para esta visita.
  }
  window.dispatchEvent(new Event(EVENTO_CAMBIO))
  if (valor === 'si') return cargarGTM()
  borrarCookiesGA()
  if (antes === 'si' && cargado) location.reload()
}

import { useEffect, useSyncExternalStore } from 'react'
import { sincronizarIdioma } from './i18n.js'
import { PAGINAS, idiomaDeRuta, resolverRuta, rutaDe } from './rutas.js'

// Páginas del sitio, con rutas limpias por idioma (ver rutas.js): / (inicio), /servicios, /como-funciona, /trabajos,
// /contacto, /privacidad, /terminos y sus equivalentes en inglés bajo /en. Un #ancla opcional (/servicios#termico) baja a
// un bloque de la página. Hace falta que el alojamiento devuelva la página pre-renderizada de cada ruta (ver el .htaccess
// que genera vite.config.js; Vite ya lo hace en desarrollo).
export { PAGINAS }

// Cualquier otra dirección es la página "noencontrada": el servidor la entrega con estado 404 (404.html).
const PAGINA_NO_ENCONTRADA = 'noencontrada'
const paginaDe = (pathname) => resolverRuta(pathname)?.pagina ?? PAGINA_NO_ENCONTRADA

// Página e idioma que se pintan en el servidor (pre-renderizado); los fija entry-server.jsx antes de cada render.
let paginaServidor = 'inicio'
let idiomaServidor = 'es'
export const fijarPaginaServidor = (pagina, idioma = 'es') => {
  paginaServidor = pagina
  idiomaServidor = idioma
}

const leer = () => `${paginaDe(window.location.pathname)}|${idiomaDeRuta(window.location.pathname)}|${window.location.hash.slice(1)}`

const suscribir = (aviso) => {
  // Antes de avisar de la nueva dirección se pone su idioma, para que la página nueva se pinte ya en él.
  const alNavegar = () => {
    sincronizarIdioma(window.location.pathname)
    aviso()
  }
  window.addEventListener('popstate', alNavegar)
  window.addEventListener('navegar', alNavegar)
  window.addEventListener('hashchange', aviso)
  return () => {
    window.removeEventListener('popstate', alNavegar)
    window.removeEventListener('navegar', alNavegar)
    window.removeEventListener('hashchange', aviso)
  }
}

/** Cambia de página sin recargar. Si ya se está en esa misma dirección, solo vuelve arriba. */
export function navegar(destino) {
  const url = new URL(destino, window.location.href)
  const igual = url.pathname === window.location.pathname && url.hash === window.location.hash
  if (igual) return window.scrollTo({ top: 0, behavior: 'instant' })
  const sitio = resolverRuta(url.pathname)
  window.history.pushState(null, '', (sitio ? rutaDe(sitio.pagina, sitio.idioma) : url.pathname) + url.hash)
  window.dispatchEvent(new Event('navegar'))
}

// Los enlaces internos (<a href="/servicios">) navegan sin recargar; el resto (anclas, tel:, mailto:, externos) sigue normal.
function interceptar(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const a = e.target.closest?.('a[href]')
  if (!a || a.target || a.hasAttribute('download')) return
  const url = new URL(a.href, window.location.href)
  if (url.origin !== window.location.origin || a.getAttribute('href').startsWith('#')) return
  // Solo las rutas del sitio; un enlace a /img/ficha.pdf o similar se deja al navegador.
  if (!resolverRuta(url.pathname)) return
  e.preventDefault()
  navegar(url.pathname + url.hash)
}

// En el servidor, la página fijada; al hidratar en el navegador, la de la dirección actual (coincide con el HTML pre-renderizado de esa ruta).
const leerServidor = () =>
  typeof window === 'undefined'
    ? `${paginaServidor}|${idiomaServidor}|`
    : `${paginaDe(window.location.pathname)}|${idiomaDeRuta(window.location.pathname)}|`

/** Devuelve { pagina, idioma, ancla } de la dirección actual. Sin efectos: sirve para cualquier componente. */
export function usePaginaActual() {
  const [pagina, idioma, ...resto] = useSyncExternalStore(suscribir, leer, leerServidor).split('|')
  return { pagina, idioma, ancla: resto.join('|') }
}

/** Igual que usePaginaActual, y además hace que los enlaces internos cambien de página sin recargar (solo lo usa App). */
export default function useRuta() {
  const ruta = usePaginaActual()
  useEffect(() => {
    document.addEventListener('click', interceptar)
    return () => document.removeEventListener('click', interceptar)
  }, [])
  return ruta
}

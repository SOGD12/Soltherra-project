import { useEffect, useSyncExternalStore } from 'react'

// Páginas del sitio, con rutas limpias: /home, /servicios, /como-funciona, /trabajos, /contacto.
// Un #ancla opcional (/servicios#termico) baja a un bloque de la página. Hace falta que el alojamiento
// devuelva index.html en esas rutas (ver "rewrites" en vercel.json; Vite ya lo hace en desarrollo).
export const PAGINAS = ['inicio', 'servicios', 'como-funciona', 'trabajos', 'contacto']

const RUTA_DE = (pagina) => (pagina === 'inicio' ? '/home' : `/${pagina}`)
const PAGINA_DE = (ruta) => {
  const tramo = ruta.replace(/^\/+|\/+$/g, '')
  return tramo === 'home' || !tramo ? 'inicio' : PAGINAS.includes(tramo) ? tramo : 'inicio'
}

// La raíz "/" y las rutas desconocidas se muestran como /home.
if (typeof window !== 'undefined') {
  const { pathname, search, hash } = window.location
  const conocida = ['home', ...PAGINAS].includes(pathname.replace(/^\/+|\/+$/g, ''))
  if (!conocida) window.history.replaceState(null, '', `/home${search}${hash}`)
}

// Página que se pinta en el servidor (pre-renderizado); la fija entry-server.jsx antes de cada render.
let paginaServidor = 'inicio'
export const fijarPaginaServidor = (pagina) => {
  paginaServidor = pagina
}

const leer = () => `${PAGINA_DE(window.location.pathname)}|${window.location.hash.slice(1)}`

const suscribir = (aviso) => {
  window.addEventListener('popstate', aviso)
  window.addEventListener('hashchange', aviso)
  window.addEventListener('navegar', aviso)
  return () => {
    window.removeEventListener('popstate', aviso)
    window.removeEventListener('hashchange', aviso)
    window.removeEventListener('navegar', aviso)
  }
}

/** Cambia de página sin recargar. Si ya se está en esa misma dirección, solo vuelve arriba. */
export function navegar(destino) {
  const url = new URL(destino, window.location.href)
  const igual = url.pathname === window.location.pathname && url.hash === window.location.hash
  if (igual) return window.scrollTo({ top: 0, behavior: 'instant' })
  window.history.pushState(null, '', RUTA_DE(PAGINA_DE(url.pathname)) + url.hash)
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
  if (!['home', ...PAGINAS].includes(url.pathname.replace(/^\/+|\/+$/g, ''))) return
  e.preventDefault()
  navegar(url.pathname + url.hash)
}

// En el servidor, la página fijada; al hidratar en el navegador, la de la dirección actual (coincide con el HTML pre-renderizado de esa ruta).
const leerServidor = () => `${typeof window === 'undefined' ? paginaServidor : PAGINA_DE(window.location.pathname)}|`

/** Devuelve { pagina, ancla }. */
export default function useRuta() {
  const [pagina, ancla] = useSyncExternalStore(suscribir, leer, leerServidor).split('|')
  useEffect(() => {
    document.addEventListener('click', interceptar)
    return () => document.removeEventListener('click', interceptar)
  }, [])
  return { pagina, ancla }
}

import { useEffect, useRef } from 'react'
import { aplicarSeo } from '../seo.js'

/** Baja al bloque pedido y lo mantiene en su sitio un instante mientras cargan fuentes e imágenes.
 *  Devuelve una función que cancela esa vigilancia. */
function irAlBloque(destino) {
  destino.scrollIntoView({ behavior: 'instant' })
  const ir = () => destino.scrollIntoView({ behavior: 'instant' })
  const observador = new ResizeObserver(ir)
  observador.observe(document.body)
  const parar = () => observador.disconnect()
  const id = setTimeout(parar, 2000)
  // Si la persona ya empezó a moverse, se deja de recolocar.
  const eventos = ['wheel', 'touchstart', 'keydown', 'pointerdown']
  eventos.forEach((e) => window.addEventListener(e, parar, { passive: true, once: true }))
  return () => {
    clearTimeout(id)
    parar()
    eventos.forEach((e) => window.removeEventListener(e, parar))
  }
}

/** Al cambiar de página: actualiza el SEO, vuelve arriba (o baja al bloque pedido) y pasa el foco al contenido nuevo. */
export default function useScrollPagina(pagina, ancla) {
  const anterior = useRef(pagina)
  useEffect(() => {
    aplicarSeo(pagina)
    const destino = ancla && document.getElementById(ancla)
    let cancelar = () => {}
    if (destino) cancelar = irAlBloque(destino)
    else window.scrollTo({ top: 0, behavior: 'instant' })
    // El <main> se vuelve a crear en cada página: se le da el foco para que teclado y lector de pantalla
    // sigan desde el contenido nuevo (y anuncien el título) en vez de quedar en el vacío.
    if (anterior.current !== pagina) {
      anterior.current = pagina
      document.getElementById('contenido')?.focus({ preventScroll: true })
    }
    return cancelar
  }, [pagina, ancla])
}

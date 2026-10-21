import { useEffect } from 'react'

/** Carga Anime.js aparte, después del primer pintado, para no engordar el paquete inicial. */
export default function useAnimaciones() {
  useEffect(() => {
    document.documentElement.classList.add('js')
    let vivo = true
    let limpiar = () => {}
    import('../animaciones.js').then((m) => {
      if (vivo) limpiar = m.iniciarAnimaciones()
    })
    return () => {
      vivo = false
      limpiar()
    }
  }, [])
}

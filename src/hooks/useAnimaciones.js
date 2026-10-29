import { useEffect } from 'react'

/** Carga Anime.js aparte, después del primer pintado, para no engordar el paquete inicial.
 *  Se vuelve a iniciar en cada página, porque cada una monta secciones distintas. */
export default function useAnimaciones(pagina) {
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
  }, [pagina])
}

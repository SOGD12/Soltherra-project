import { useEffect } from 'react'

/** Publica --progreso (0 a 1) para la barra de la cabecera y marca si la cabecera debe encogerse (siempre queda visible). */
export default function useProgresoScroll() {
  useEffect(() => {
    const raiz = document.documentElement
    let marco = 0
    const medir = () => {
      marco = 0
      const y = window.scrollY
      const max = raiz.scrollHeight - window.innerHeight
      raiz.style.setProperty('--progreso', max > 0 ? (y / max).toFixed(4) : '0')
      raiz.dataset.desplazado = y > 40 ? 'si' : 'no'
    }
    const alScroll = () => {
      if (!marco) marco = requestAnimationFrame(medir)
    }
    medir()
    window.addEventListener('scroll', alScroll, { passive: true })
    window.addEventListener('resize', alScroll)
    return () => {
      cancelAnimationFrame(marco)
      window.removeEventListener('scroll', alScroll)
      window.removeEventListener('resize', alScroll)
    }
  }, [])
}

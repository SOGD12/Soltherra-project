import { useEffect } from 'react'

/** Publica en --progreso (0 a 1) cuánto se ha avanzado en la página, para la barra bajo la cabecera. */
export default function useProgresoScroll() {
  useEffect(() => {
    let marco = 0
    const medir = () => {
      marco = 0
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      const root = document.documentElement.style
      root.setProperty('--progreso', max > 0 ? (y / max).toFixed(4) : '0')
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

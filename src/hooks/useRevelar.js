import { useEffect } from 'react'

/** Marca con la clase 'visto' los elementos [data-revelar] y [data-sube] al entrar en pantalla. */
export default function useRevelar() {
  useEffect(() => {
    document.documentElement.classList.add('js')
    const items = document.querySelectorAll('[data-revelar], [data-sube]')
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('visto'))
      return
    }
    const io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visto')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

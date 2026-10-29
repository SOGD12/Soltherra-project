import { useEffect, useRef, useState } from 'react'
import { BotonWA } from './Comunes.jsx'
import { TEL, CORREO, nav } from '../data/contenido.js'

const pagina_de = (h) => (h === '/home' ? 'inicio' : h.slice(1))

export default function Header({ pagina }) {
  const [abierto, setAbierto] = useState(false)
  const botonMenu = useRef(null)

  useEffect(() => {
    document.body.classList.toggle('sin-scroll', abierto)
    if (!abierto) return () => document.body.classList.remove('sin-scroll')
    const cerrar = (e) => {
      if (e.key !== 'Escape') return
      setAbierto(false)
      botonMenu.current?.focus()
    }
    // Si se pasa a escritorio con el menú abierto, el botón desaparece: se cierra para no dejar el scroll bloqueado.
    const ancho = window.matchMedia('(min-width: 900px)')
    const alCambiar = (e) => e.matches && setAbierto(false)
    window.addEventListener('keydown', cerrar)
    ancho.addEventListener('change', alCambiar)
    return () => {
      window.removeEventListener('keydown', cerrar)
      ancho.removeEventListener('change', alCambiar)
      document.body.classList.remove('sin-scroll')
    }
  }, [abierto])

  return (
    <header className="cabecera" data-abierto={abierto}>
      <div className="cabecera__pildora">
        <a className="cabecera__logo" href="/home" aria-label="Soltherra S.A.S., ir al inicio">
          <img src="/img/logo.webp" alt="Soltherra S.A.S. Energía Sostenible" width="105" height="56" />
        </a>
        <nav className="cabecera__nav" aria-label="Principal">
          {nav.map(([t, h]) => (
            <a key={h} href={h} aria-current={pagina_de(h) === pagina ? 'page' : undefined}>
              {t}
            </a>
          ))}
        </nav>
        <BotonWA texto="Cotizar" variante="boton--viva" corto />
        <button
          type="button"
          ref={botonMenu}
          className="cabecera__menu"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          onClick={() => setAbierto((v) => !v)}
        >
          <span className="sr">{abierto ? 'Cerrar menú' : 'Abrir menú'}</span>
          <span className="cabecera__barras" aria-hidden="true" />
        </button>
        <span className="progreso" aria-hidden="true" />
      </div>
      <div id="menu-movil" className="menu-movil" hidden={!abierto}>
        <nav aria-label="Menú móvil">
          {nav.map(([t, h]) => (
            <a key={h} href={h} aria-current={pagina_de(h) === pagina ? 'page' : undefined} onClick={() => setAbierto(false)}>
              {t}
            </a>
          ))}
        </nav>
        <div className="menu-movil__pie">
          <a href="tel:+573138130046">{TEL}</a>
          <a href={`mailto:${CORREO}`}>{CORREO}</a>
          <BotonWA texto="Escríbenos por WhatsApp" variante="boton--viva" />
        </div>
      </div>
    </header>
  )
}

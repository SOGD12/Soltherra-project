import { useEffect, useState } from 'react'
import { BotonWA } from './Comunes.jsx'
import { TEL, CORREO, nav } from '../data/contenido.js'

export default function Header() {
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('sin-scroll', abierto)
    const cerrar = (e) => e.key === 'Escape' && setAbierto(false)
    window.addEventListener('keydown', cerrar)
    return () => {
      window.removeEventListener('keydown', cerrar)
      document.body.classList.remove('sin-scroll')
    }
  }, [abierto])

  return (
    <header className="cabecera" data-abierto={abierto}>
      <div className="cabecera__pildora">
        <a className="cabecera__logo" href="#inicio" aria-label="Soltherra S.A.S., ir al inicio">
          <img src="/img/logo.webp" alt="Soltherra S.A.S. Energía Sostenible" width="105" height="56" />
        </a>
        <nav className="cabecera__nav" aria-label="Principal">
          {nav.map(([t, h]) => (
            <a key={h} href={h}>
              {t}
            </a>
          ))}
        </nav>
        <BotonWA texto="Cotizar" variante="boton--viva" corto />
        <button
          type="button"
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
            <a key={h} href={h} onClick={() => setAbierto(false)}>
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

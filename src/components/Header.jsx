import { useEffect, useState } from 'react'
import { nav, wa } from '../data/contenido.js'
import { IconoWhatsApp } from './Iconos.jsx'

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
    <header className="cabecera">
      <div className="cabecera__barra">
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
        <a
          className="boton boton--corto"
          href={wa('Hola Soltherra, quiero cotizar un sistema solar.')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconoWhatsApp />
          <span>WhatsApp</span>
        </a>
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
      </div>
      <div className="progreso" aria-hidden="true" />
      <div id="menu-movil" className="menu-movil" data-abierto={abierto} hidden={!abierto}>
        <nav aria-label="Menú móvil">
          {nav.map(([t, h]) => (
            <a key={h} href={h} onClick={() => setAbierto(false)}>
              {t}
            </a>
          ))}
        </nav>
        <a
          className="boton boton--viva"
          href={wa('Hola Soltherra, quiero cotizar un sistema solar.')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconoWhatsApp />
          <span>Escríbenos por WhatsApp</span>
        </a>
      </div>
    </header>
  )
}

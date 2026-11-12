import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BotonWA } from './Comunes.jsx'
import Idioma from './Idioma.jsx'
import { nav } from '../data/contenido.js'

const pagina_de = (h) => (h === '/home' ? 'inicio' : h.slice(1))

export default function Header({ pagina }) {
  const { t } = useTranslation('global')
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
        <a className="cabecera__logo" href="/home" aria-label={t('header.logo-label')}>
          <img src="/img/logo-claro.webp" alt={t('header.logo-alt')} width="103" height="48" />
        </a>
        <nav className="cabecera__nav" aria-label={t('menu.main-label')}>
          {nav.map(([clave, h]) => (
            <a key={h} href={h} aria-current={pagina_de(h) === pagina ? 'page' : undefined}>
              {t(`menu.${clave}`)}
            </a>
          ))}
        </nav>
        <Idioma className="idioma--cabecera" />
        <BotonWA texto={t('header.quote')} variante="boton--viva" corto />
        <button
          type="button"
          ref={botonMenu}
          className="cabecera__menu"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          onClick={() => setAbierto((v) => !v)}
        >
          <span className="sr">{abierto ? t('menu.close') : t('menu.open')}</span>
          <span className="cabecera__barras" aria-hidden="true" />
        </button>
        <span className="progreso" aria-hidden="true" />
      </div>
      <div id="menu-movil" className="menu-movil" hidden={!abierto}>
        <nav aria-label={t('menu.mobile-label')}>
          {nav.map(([clave, h]) => (
            <a key={h} href={h} aria-current={pagina_de(h) === pagina ? 'page' : undefined} onClick={() => setAbierto(false)}>
              {t(`menu.${clave}`)}
            </a>
          ))}
        </nav>
        <div className="menu-movil__pie">
          <Idioma />
          <BotonWA texto={t('header.whatsapp')} variante="boton--viva" />
        </div>
      </div>
    </header>
  )
}

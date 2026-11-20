import { useTranslation } from 'react-i18next'
import { Chip } from './Comunes.jsx'
import { nav } from '../data/contenido.js'
import useEnlace from '../hooks/useEnlace.js'

// Página que se muestra en cualquier dirección que no existe. El servidor la entrega con estado 404 (404.html, sin indexar).
export default function NoEncontrada() {
  const { t } = useTranslation('global')
  const enlace = useEnlace()
  return (
    <section className="legal no-encontrada">
      <div className="contenedor legal__texto">
        <Chip>404</Chip>
        <h1>{t('notfound.title')}</h1>
        <p>{t('notfound.text')}</p>
        <p>
          <a className="boton boton--viva" href={enlace('/')}>
            {t('notfound.home')}
          </a>
        </p>
        <ul className="no-encontrada__enlaces">
          {nav
            .filter(([, href]) => href !== '/')
            .map(([clave, href]) => (
              <li key={href}>
                <a href={enlace(href)}>{t(`menu.${clave}`)}</a>
              </li>
            ))}
        </ul>
      </div>
    </section>
  )
}

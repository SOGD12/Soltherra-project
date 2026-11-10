import { useTranslation } from 'react-i18next'
import { Icono } from './Iconos.jsx'
import { BotonWA, Chip } from './Comunes.jsx'
import { nav } from '../data/contenido.js'

// Cierre de Inicio: lleva a las otras páginas del menú (sin repetir Inicio ni Contacto) y deja el WhatsApp a mano.
const destinos = nav.filter(([, href]) => href !== '/home' && href !== '/contacto')

export default function Cierre() {
  const { t } = useTranslation('global')
  return (
    <section className="seccion cierre" aria-labelledby="t-cierre">
      <div className="contenedor">
        <div className="cierre__cabeza">
          <div>
            <Chip>{t('home.closing.chip')}</Chip>
            <h2 id="t-cierre">
              {t('home.closing.title-before')}<em className="acento">{t('home.closing.title-accent')}</em>
            </h2>
          </div>
          <BotonWA texto={t('whatsapp.quote')} />
        </div>
        <ul className="cierre__lista">
          {destinos.map(([clave, href]) => (
            <li key={href}>
              <a className="cierre__enlace" href={href}>
                <span>{t(`menu.${clave}`)}</span>
                <span className="cierre__flecha" aria-hidden="true">
                  <Icono nombre="arrow_outward" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

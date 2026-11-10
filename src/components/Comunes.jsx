import { useTranslation } from 'react-i18next'
import { IconoWhatsApp } from './Iconos.jsx'
import { wa } from '../data/contenido.js'

export function BotonWA({ texto, mensaje, variante = '', corto = false }) {
  const { t } = useTranslation('global')
  return (
    <a
      className={`boton ${variante} ${corto ? 'boton--corto' : ''}`.trim()}
      href={wa(mensaje ?? t('whatsapp.default'))}
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconoWhatsApp />
      <span>{texto}</span>
    </a>
  )
}

/** Cierre de sección: invitación a hablar con un experto por WhatsApp, con un mensaje propio de cada sección.
 *  `clave` es la sección de global.json con title, text, button y message (ej. 'works.expert'). */
export function LlamadaExperto({ clave }) {
  const { t } = useTranslation('global')
  return (
    <section className="experto-seccion">
      <div className="contenedor">
        <div className="experto">
          <div className="experto__texto">
            <h3>{t(`${clave}.title`)}</h3>
            <p>{t(`${clave}.text`)}</p>
          </div>
          <BotonWA texto={t(`${clave}.button`)} mensaje={t(`${clave}.message`)} variante="boton--viva" />
        </div>
      </div>
    </section>
  )
}

export function Chip({ children, claro = false }) {
  return <p className={`chip ${claro ? 'chip--claro' : ''}`.trim()}>{children}</p>
}

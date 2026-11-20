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
/** Pill label. With `as="h2"` it is also the heading of its section (looks the same: see .chip in base.css). */
/** Pill label. With `as="h2"` it is also the section heading de su sección (se ve igual: ver .chip en base.css). */
export function Chip({ children, claro = false, as: Tag = 'p' }) {
  return <Tag className={`chip ${claro ? 'chip--claro' : ''}`.trim()}>{children}</Tag>
}

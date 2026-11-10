import { useTranslation } from 'react-i18next'
import { Icono } from './Iconos.jsx'

export default function Cinta() {
  const { t } = useTranslation('global')
  const cinta = t('home.ribbon.items', { returnObjects: true })
  // La lista va dos veces para que el bucle sea continuo; la copia se oculta a lectores de pantalla.
  const grupo = (copia) => (
    <ul className="cinta__grupo" aria-hidden={copia || undefined}>
      {cinta.map((t) => (
        <li key={t}>
          <Icono nombre="light_mode" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="cinta" id="cinta" aria-label={t('home.ribbon.label')}>
      <div className="cinta__pista">
        {grupo(false)}
        {grupo(true)}
      </div>
    </div>
  )
}

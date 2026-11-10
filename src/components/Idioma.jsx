import { useTranslation } from 'react-i18next'
import { IDIOMAS, cambiarIdioma } from '../i18n.js'

/** Selector de idioma (español / inglés): cambia todos los textos del sitio y recuerda la elección en una cookie. */
export default function Idioma({ className = '' }) {
  const { t, i18n } = useTranslation('global')
  return (
    <div className={`idioma ${className}`.trim()} role="group" aria-label={t('settings.language.label')}>
      {IDIOMAS.map((l) => (
        <button key={l} type="button" lang={l} aria-pressed={i18n.language === l} aria-label={t(`settings.language.${l}`)} onClick={() => cambiarIdioma(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

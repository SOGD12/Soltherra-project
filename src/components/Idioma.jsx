import { useTranslation } from 'react-i18next'
import { IDIOMAS } from '../i18n.js'
import { HREFLANG, rutaDe } from '../rutas.js'
import { usePaginaActual } from '../ruta.js'

/** Selector de idioma (español / inglés). Cada idioma es un enlace a la misma página en ese idioma (/servicios y /en/services):
 *  el idioma lo decide la dirección, así que cada versión se puede compartir, indexar y abrir directamente. */
export default function Idioma({ className = '' }) {
  const { t, i18n } = useTranslation('global')
  const { pagina, ancla } = usePaginaActual()
  return (
    <div className={`idioma ${className}`.trim()} role="group" aria-label={t('settings.language.label')}>
      {IDIOMAS.map((l) => (
        <a
          key={l}
          href={rutaDe(pagina, l) + (ancla ? `#${ancla}` : '')}
          lang={l}
          hrefLang={HREFLANG[l]}
          aria-current={i18n.language === l ? 'true' : undefined}
          aria-label={t(`settings.language.${l}`)}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  )
}

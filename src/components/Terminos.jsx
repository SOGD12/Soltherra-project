import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { CORREO, DIRECCION } from '../data/contenido.js'

// Términos y condiciones de uso del sitio. Textos en languages/<idioma>/global.json (sección "terms"); revisar con el cliente.
export default function Terminos() {
  const { t } = useTranslation('global')
  const secciones = t('terms.sections', { returnObjects: true })
  return (
    <section className="legal">
      <div className="contenedor legal__texto">
        <h1>{t('terms.title')}</h1>
        <p>{t('terms.updated')}</p>

        {secciones.map((s) => (
          <Fragment key={s.title}>
            <h2>{s.title}</h2>
            <p>
              {s.text.replace('{{address}}', DIRECCION)}
              {s.email && (
                <>
                  {' '}
                  <a href={`mailto:${CORREO}`}>{CORREO}</a>
                  {s.after}
                </>
              )}
            </p>
          </Fragment>
        ))}
      </div>
    </section>
  )
}

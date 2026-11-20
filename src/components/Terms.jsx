import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { CORREO, DIRECCION } from '../data/contenido.js'

// Website terms of use. Texts live in languages/<lang>/global.json (section "terms"); review them with the client.
export default function Terms() {
  const { t } = useTranslation('global')
  const sections = t('terms.sections', { returnObjects: true })
  return (
    <section className="legal">
      <div className="contenedor legal__texto">
        <h1>{t('terms.title')}</h1>
        <p>{t('terms.updated')}</p>

        {sections.map((s) => (
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

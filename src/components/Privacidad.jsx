import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { CORREO, DIRECCION } from '../data/contenido.js'

// Política de tratamiento de datos personales (Ley 1581 de 2012 y Decreto 1377 de 2013 de Colombia;
// buenas prácticas de ISO/IEC 27701). Debe mantenerse igual a lo que hace el formulario de Contacto.
// Los textos están en languages/<idioma>/global.json (sección "privacy"); las secciones con `email` llevan el correo como enlace.
export default function Privacidad() {
  const { t } = useTranslation('global')
  const secciones = t('privacy.sections', { returnObjects: true })
  return (
    <section className="legal">
      <div className="contenedor legal__texto">
        <h1>{t('privacy.title')}</h1>
        <p>{t('privacy.updated')}</p>

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

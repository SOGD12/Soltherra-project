import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Chip } from './Comunes.jsx'
import { GUIAS_ACTIVAS } from '../seo.js'

// Convierte "[texto](/ruta)" en enlaces internos (ruta.js los intercepta y cambia de página sin recargar).
function ConEnlaces({ texto }) {
  return texto.split(/(\[[^\]]+\]\([^)]+\))/g).map((parte, i) => {
    const enlace = parte.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    return enlace ? (
      <a key={i} href={enlace[2]}>
        {enlace[1]}
      </a>
    ) : (
      <Fragment key={i}>{parte}</Fragment>
    )
  })
}

/** Texto de apoyo y preguntas frecuentes al final de cada página (guide.<página> en global.json).
 *  Va en el HTML pre-renderizado: lo leen los buscadores, y vite.config.js arma con él el JSON-LD FAQPage. */
export default function Guia({ pagina }) {
  const { t } = useTranslation('global')
  if (!GUIAS_ACTIVAS.includes(pagina)) return null
  const guia = t(`guide.${pagina}`, { returnObjects: true })
  const id = `t-guia-${pagina}`
  return (
    <section className="seccion guia" aria-labelledby={id}>
      <div className="contenedor guia__rejilla">
        <div className="guia__texto">
          <Chip>{guia.chip}</Chip>
          <h2 id={id}>{guia.title}</h2>
          {guia.intro?.map((p) => (
            <p key={p}>
              <ConEnlaces texto={p} />
            </p>
          ))}
          {guia.sections?.map((s, i) => {
            const Lista = s.ordered ? 'ol' : 'ul'
            return (
              <Fragment key={i}>
                {s.title && <h3>{s.title}</h3>}
                {s.text?.map((p) => (
                  <p key={p}>
                    <ConEnlaces texto={p} />
                  </p>
                ))}
                {s.items && (
                  <Lista>
                    {s.items.map((item) => (
                      <li key={item}>
                        <ConEnlaces texto={item} />
                      </li>
                    ))}
                  </Lista>
                )}
              </Fragment>
            )
          })}
        </div>
        {guia.faq && (
          <div className="guia__faq">
            <h2>{guia['faq-title']}</h2>
            {guia.faq.map(({ q, a }) => (
              <details key={q}>
                <summary>
                  <h3>{q}</h3>
                </summary>
                <p>
                  <ConEnlaces texto={a} />
                </p>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

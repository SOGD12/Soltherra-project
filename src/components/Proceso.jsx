import { useTranslation } from 'react-i18next'
import { Icono } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import { pasos } from '../data/contenido.js'

export default function Proceso() {
  const { t } = useTranslation('global')
  const textos = t('how-it-works.process.steps', { returnObjects: true })
  return (
    <section className="seccion proceso" id="proceso" aria-labelledby="t-proceso">
      <div className="contenedor">
        <div className="titulo-seccion titulo-seccion--fila">
          <div>
            <Chip>{t('how-it-works.process.chip')}</Chip>
            {/* Las palabras van en cajas para que el CSS las haga subir una a una (ver .pal en src/styles/base.css) */}
            <h2 id="t-proceso" data-palabras>
              <span className="pal" style={{ '--i': 0 }}>
                <span>{t('how-it-works.process.title-1')}</span>
              </span>{' '}
              <em className="acento">
                <span className="pal" style={{ '--i': 1 }}>
                  <span>{t('how-it-works.process.title-2')}</span>
                </span>
              </em>
            </h2>
          </div>
          {/* <p>Te acompañamos desde la ingeniería hasta la puesta en marcha, y después del arranque también.</p> */}
        </div>
        <div className="pasos__caja">
          <span className="pasos__linea" aria-hidden="true">
            <span />
          </span>
          <ol className="pasos">
            {pasos.map((icono, i) => (
              <li key={icono}>
                <span className="pasos__marca">
                  <Icono nombre={icono} />
                </span>
                <span className="pasos__n" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3>{textos[i].title}</h3>
                <p>{textos[i].text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

import { useTranslation } from 'react-i18next'
import { Icono } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import { gestiones } from '../data/contenido.js'

export default function Gestiones() {
  const { t } = useTranslation('global')
  const textos = t('engineering.items', { returnObjects: true })
  return (
    <section className="seccion-isla" id="gestiones" aria-labelledby="t-gestiones">
      <div className="isla gestiones" data-isla>
        <span className="isla__brillo" aria-hidden="true" />
        <div className="contenedor gestiones__rejilla">
          <div className="titulo-seccion">
            <Chip claro>{t('engineering.chip')}</Chip>
            <h1 id="t-gestiones" data-titulo>
              {t('engineering.title-before')}<em className="acento">{t('engineering.title-accent')}</em>{t('engineering.title-after')}
            </h1>
            <p>{t('engineering.subtitle')}</p>
          </div>
          <ul className="gestiones__lista">
            {gestiones.map((icono, i) => (
              <li key={icono}>
                <span className="gestiones__icono">
                  <Icono nombre={icono} />
                </span>
                <h3>{textos[i].title}</h3>
                <p>{textos[i].text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

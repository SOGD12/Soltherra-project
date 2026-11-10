import { useTranslation } from 'react-i18next'
import { Icono } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import { beneficios } from '../data/contenido.js'

export default function Beneficios() {
  const { t } = useTranslation('global')
  const textos = t('works.benefits.items', { returnObjects: true })
  return (
    <section className="seccion beneficios" id="beneficios">
      <div className="contenedor beneficios__rejilla">
        <div className="beneficios__titulo">
          <Chip>{t('works.benefits.chip')}</Chip>
          <h2 data-titulo>
            {t('works.benefits.title-before')}<em className="acento">{t('works.benefits.title-accent')}</em>
          </h2>
        </div>
        <ul className="beneficios__lista">
          {beneficios.map((icono, i) => (
            <li key={icono} data-fila>
              <span className="beneficios__icono">
                <Icono nombre={icono} />
              </span>
              <span>{textos[i]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

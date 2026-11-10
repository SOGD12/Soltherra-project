import { useTranslation } from 'react-i18next'
import { Icono } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import { soluciones } from '../data/contenido.js'
import fotos from '../data/imagenes/soluciones.json'

export default function Soluciones() {
  const { t } = useTranslation('global')
  return (
    <section className="seccion soluciones" id="soluciones" aria-labelledby="t-soluciones">
      <div className="contenedor">
        <div className="titulo-seccion">
          <Chip>{t('home.solutions.chip')}</Chip>
          <h2 id="t-soluciones" data-titulo>
            {t('home.solutions.title-before')}<em className="acento">{t('home.solutions.title-accent')}</em>{t('home.solutions.title-after')}
          </h2>
        </div>
        <div className="bento">
          {soluciones.map((s) => {
            const f = fotos[s.imagen]
            return (
            <a key={s.clave} className={`bento__tarjeta ${s.clase}`} href={s.href}>
              <img src={f.foto} alt={t(`images.solutions.${s.imagen}`, { defaultValue: f.alt })} width={f.ancho} height={f.alto} loading="lazy" decoding="async" />
              <span className="bento__velo" aria-hidden="true" />
              <span className="bento__titulo">{t(`home.solutions.items.${s.clave}`)}</span>
              <span className="bento__flecha" aria-hidden="true">
                <Icono nombre="arrow_outward" />
              </span>            </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

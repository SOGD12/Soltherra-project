import { useTranslation } from 'react-i18next'
import { Icono } from './Iconos.jsx'
import { BotonWA, Chip } from './Comunes.jsx'
import fotosServicio from '../data/imagenes/servicios.json'

function Lista({ items }) {
  return (
    <ul className="filas">
      {items.map((t) => (
        <li key={t}>
          <Icono nombre="check_circle" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

// `clave` es la sección de global.json (services.<clave>) con chip, title, text, list, closing y message.
// `fotos` es la clave de servicios.json y de images.services.* (alt de cada foto).
function Servicio({ id, clave, inversa, panoramica, icono, fotos }) {
  const { t } = useTranslation('global')
  const imagenes = fotosServicio[fotos]
  // Español: alt del JSON de la foto; inglés: images.services.<fotos>.<posición> en global.json
  const alt = (k) => t(`images.services.${fotos}.${k}`, { defaultValue: imagenes[k].alt })
  return (
    <section className={`seccion servicio ${inversa ? 'servicio--inversa' : ''} ${panoramica ? 'servicio--panoramica' : ''}`} id={id}>
      <div className="contenedor servicio__rejilla">
        <div className="servicio__fotos">
          <figure className="foto servicio__principal" data-parallax>
            <img src={imagenes[0].foto} alt={alt(0)} width={imagenes[0].ancho} height={imagenes[0].alto} loading="lazy" />
          </figure>
          <figure className="foto servicio__inserto" data-flotar>
            <img src={imagenes[1].foto} alt={alt(1)} width={imagenes[1].ancho} height={imagenes[1].alto} loading="lazy" />
          </figure>
        </div>
        <div className="servicio__texto">
          <Chip>
            <Icono nombre={icono} /> {t(`services.${clave}.chip`)}
          </Chip>
          <h2 data-titulo>{t(`services.${clave}.title`)}</h2>
          <p>{t(`services.${clave}.text`)}</p>
          <Lista items={t(`services.${clave}.list`, { returnObjects: true })} />
          <p className="servicio__cierre">{t(`services.${clave}.closing`)}</p>
          <BotonWA texto={t('whatsapp.expert')} mensaje={t(`services.${clave}.message`)} />
        </div>
      </div>
    </section>
  )
}

export default function Servicios() {
  const { t } = useTranslation('global')
  return (
    <>
      <section className="seccion servicios__intro" id="servicios" aria-labelledby="t-servicios">
        <div className="contenedor titulo-seccion">
          <Chip>{t('services.intro.chip')}</Chip>
          <h2 id="t-servicios" data-titulo>
            {t('services.intro.title-before')}<em className="acento">{t('services.intro.title-accent')}</em>
          </h2>
        </div>
      </section>
      <Servicio id="fotovoltaico" clave="photovoltaic" icono="solar_power" fotos="fotovoltaico" />
      <Servicio id="termico" clave="thermal" inversa icono="thermostat" fotos="termico" />
      <Servicio id="piscina" clave="pool" panoramica icono="pool" fotos="piscina" />
      <Servicio id="carga-ev" clave="ev" inversa icono="ev_station" fotos="carga-ev" />
      <Servicio id="mantenimiento" clave="maintenance" icono="build" fotos="mantenimiento" />
      <Servicio id="tramites" clave="procedures" inversa icono="receipt_long" fotos="tramites" />
    </>
  )
}

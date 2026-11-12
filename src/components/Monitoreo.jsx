import { useTranslation } from 'react-i18next'

// Dos videos: el vertical para móvil y el horizontal para el resto. CSS muestra solo uno
// y preload="none" evita descargar el que no se ve.
export default function Monitoreo() {
  const { t, i18n } = useTranslation('global')
  // En inglés se usan los videos con la narración y los textos en inglés (archivos con sufijo -en).
  const sufijo = i18n.language === 'en' ? '-en' : ''
  return (
    <section className="seccion monitoreo" id="monitoreo" aria-labelledby="t-monitoreo">
      <div className="contenedor">
        <div className="monitoreo__texto">
          <h2 id="t-monitoreo" data-titulo>
            {t('how-it-works.monitoring.title-before')}<em className="acento">{t('how-it-works.monitoring.title-accent')}</em>
          </h2>
        </div>
        <div className="monitoreo__video">
          <video
            key={`escritorio${sufijo}`}
            className="monitoreo__v monitoreo__v--escritorio"
            controls
            playsInline
            preload="none"
            poster={`/video/monitoreo-escritorio${sufijo}.webp`}
            width="1920"
            height="1080"
            aria-label={t('how-it-works.monitoring.aria-desktop')}
          >
            <source src={`/video/monitoreo-escritorio${sufijo}.mp4`} type="video/mp4" />
            <a href={`/video/monitoreo-escritorio${sufijo}.mp4`} rel="nofollow" download>{t('how-it-works.monitoring.download')}</a>
          </video>
          <video
            key={`movil${sufijo}`}
            className="monitoreo__v monitoreo__v--movil"
            controls
            playsInline
            preload="none"
            poster={`/video/monitoreo-movil${sufijo}.webp`}
            width="1080"
            height="1920"
            aria-label={t('how-it-works.monitoring.aria-mobile')}
          >
            <source src={`/video/monitoreo-movil${sufijo}.mp4`} type="video/mp4" />
            <a href={`/video/monitoreo-movil${sufijo}.mp4`} rel="nofollow" download>{t('how-it-works.monitoring.download')}</a>
          </video>
        </div>
      </div>
    </section>
  )
}

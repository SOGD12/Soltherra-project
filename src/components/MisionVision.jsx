import { useTranslation } from 'react-i18next'
import { Chip } from './Comunes.jsx'

export default function MisionVision() {
  const { t } = useTranslation('global')
  return (
    <section className="seccion-isla" aria-label={t('home.mission-vision.label')}>
      <div className="isla mision" data-isla>
        <span className="isla__brillo isla__brillo--der" aria-hidden="true" />
        <div className="contenedor mision__rejilla">
          <div className="mision__bloque">
            <Chip claro>{t('home.mission-vision.mission-chip')}</Chip>
            <p data-llenar>
              {t('home.mission-vision.mission')}
            </p>
          </div>
          <div className="mision__bloque">
            <Chip claro>{t('home.mission-vision.vision-chip')}</Chip>
            <p data-llenar>
              {t('home.mission-vision.vision')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useTranslation } from 'react-i18next'
import { Icono } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import inicio from '../data/imagenes/inicio.json'

export default function Nosotros() {
  const { t } = useTranslation('global')
  return (
    <section className="seccion nosotros" id="nosotros">
      <div className="contenedor nosotros__rejilla">
        <div className="nosotros__texto">
          <Chip>{t('home.about.chip')}</Chip>
          <p className="destacado" data-llenar>
            {t('home.about.highlight')}
          </p>
          <p>
            {t('home.about.text')}
          </p>
          <ul className="para-quien" aria-label={t('home.about.audience-label')}>
            <li>
              <Icono nombre="home" /> {t('home.about.homes')}
            </li>
            <li>
              <Icono nombre="apartment" /> {t('home.about.companies')}
            </li>
            <li>
              <Icono nombre="account_balance" /> {t('home.about.institutions')}
            </li>
          </ul>
        </div>
        <figure className="foto nosotros__foto" data-parallax>
          <img
            src={inicio.nosotros.foto}
            alt={t('images.about', { defaultValue: inicio.nosotros.alt })}
            width={inicio.nosotros.ancho}
            height={inicio.nosotros.alto}
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  )
}

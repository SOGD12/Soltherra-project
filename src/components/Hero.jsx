import { useTranslation } from 'react-i18next'
import { Icono } from './Iconos.jsx'
import { BotonWA, Chip } from './Comunes.jsx'
import inicio from '../data/imagenes/inicio.json'

export default function Hero() {
  const { t } = useTranslation('global')
  return (
    <section className="hero" id="inicio">
      <div className="hero__medio" aria-hidden="true">
        <img
          className="hero__foto"
          src={inicio.hero.foto}
          // Celular en vertical: recorte vertical más liviano (mismo encuadre que deja ver object-fit: cover).
          // En horizontal la foto cubre el alto (4:3), así que el ancho mostrado es el mayor entre 100vw y 133svh.
          srcSet={`${inicio.hero.movil} ${inicio.hero.ancho_movil}w, ${inicio.hero.foto} ${inicio.hero.ancho}w`}
          sizes="(max-aspect-ratio: 3/4) 100vw, max(100vw, 133svh)"
          alt={t('images.hero', { defaultValue: inicio.hero.alt })}
          width={inicio.hero.ancho}
          height={inicio.hero.alto}
          fetchPriority="high"
        />
      </div>
      <div className="hero__velo" />
      <div className="contenedor hero__texto">
        <Chip claro>
          <Icono nombre="location_on" /> {t('home.hero.chip')}
        </Chip>
        <h1 className="hero__titulo">
          <em className="acento">{t('home.hero.title-accent')}</em>
          {t('home.hero.title-rest')}
        </h1>
        <p className="hero__sub">
          {t('home.hero.subtitle')}
        </p>
        <div className="hero__acciones">
          <BotonWA texto={t('whatsapp.quote')} variante="boton--viva" />
          <a className="boton boton--vidrio" href="/servicios">
            <span>{t('home.hero.services')}</span>
            <Icono nombre="arrow_forward" />
          </a>
        </div>
      </div>
      <a className="hero__bajar" href="#cinta" aria-label={t('home.hero.scroll-down')}>
        <Icono nombre="south" />
      </a>
    </section>
  )
}

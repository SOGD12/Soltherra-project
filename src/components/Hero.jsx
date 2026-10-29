import { Icono } from './Iconos.jsx'
import { BotonWA, Chip } from './Comunes.jsx'
import inicio from '../data/imagenes/inicio.json'

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__medio" aria-hidden="true">
        <img
          className="hero__foto"
          src={inicio.hero.foto}
          alt={inicio.hero.alt}
          width={inicio.hero.ancho}
          height={inicio.hero.alto}
          fetchPriority="high"
        />
      </div>
      <div className="hero__velo" />
      <div className="contenedor hero__texto">
        <Chip claro>
          <Icono nombre="location_on" /> Cali, Colombia · Energía limpia que nace del sol
        </Chip>
        <h1 className="hero__titulo">
          <em className="acento">Energía solar</em> para tu hogar, tu empresa o tu institución.
        </h1>
        <p className="hero__sub">
          Diseñamos, instalamos y mantenemos sistemas solares fotovoltaicos y solares térmicos, con cumplimiento
          normativo y soluciones a la medida.
        </p>
        <div className="hero__acciones">
          <BotonWA texto="Cotizar por WhatsApp" variante="boton--viva" />
          <a className="boton boton--vidrio" href="/servicios">
            <span>Ver servicios</span>
            <Icono nombre="arrow_forward" />
          </a>
        </div>
      </div>
      <a className="hero__bajar" href="#cinta" aria-label="Bajar al contenido">
        <Icono nombre="south" />
      </a>
    </section>
  )
}

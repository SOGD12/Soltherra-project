import { wa } from '../data/contenido.js'
import { Flecha, IconoWhatsApp } from './Iconos.jsx'

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <img
        className="hero__foto"
        src="/img/hero.webp"
        alt="Paneles solares fotovoltaicos instalados en una cubierta, bajo un cielo con nubes"
        width="1800"
        height="1350"
        fetchPriority="high"
      />
      <div className="hero__velo" />
      <div className="contenedor hero__texto">
        <h1>
          <span className="linea">
            <span>Energía solar</span>
          </span>
          <span className="linea">
            <span>para tu hogar,</span>
          </span>
          <span className="linea">
            <span>tu empresa o</span>
          </span>
          <span className="linea">
            <span>tu institución.</span>
          </span>
        </h1>
        <p className="hero__sub rise">
          Diseñamos, instalamos y mantenemos sistemas solares fotovoltaicos y solares térmicos, con cumplimiento
          normativo y soluciones a la medida.
        </p>
        <div className="hero__acciones rise">
          <a
            className="boton boton--viva"
            href={wa('Hola Soltherra, quiero cotizar un sistema solar.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconoWhatsApp />
            <span>Habla con un experto</span>
          </a>
          <a className="enlace enlace--claro" href="#servicios">
            Ver servicios <Flecha />
          </a>
        </div>
      </div>
    </section>
  )
}

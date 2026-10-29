import { Icono } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import inicio from '../data/imagenes/inicio.json'

export default function Nosotros() {
  return (
    <section className="seccion nosotros" id="nosotros">
      <div className="contenedor nosotros__rejilla">
        <div className="nosotros__texto">
          <Chip>¿Quiénes somos?</Chip>
          <p className="destacado" data-llenar>
            Somos una empresa especializada en el diseño, instalación y mantenimiento de sistemas solares
            fotovoltaicos y sistemas solares térmicos.
          </p>
          <p>
            Ofrecemos soluciones energéticas sostenibles, eficientes y personalizadas para hogares, empresas e
            instituciones. Soltherra acompaña a sus clientes desde la ingeniería hasta la puesta en marcha,
            garantizando cumplimiento normativo, ahorro económico y reducción del impacto ambiental.
          </p>
          <ul className="para-quien" aria-label="Para quién trabajamos">
            <li>
              <Icono nombre="home" /> Hogares
            </li>
            <li>
              <Icono nombre="apartment" /> Empresas
            </li>
            <li>
              <Icono nombre="account_balance" /> Instituciones
            </li>
          </ul>
        </div>
        <figure className="foto nosotros__foto" data-parallax>
          <img
            src={inicio.nosotros.foto}
            alt={inicio.nosotros.alt}
            width={inicio.nosotros.ancho}
            height={inicio.nosotros.alto}
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  )
}

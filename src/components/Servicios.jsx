import { Icono } from './Iconos.jsx'
import { BotonWA, Chip } from './Comunes.jsx'
import { fotovoltaico, termico } from '../data/contenido.js'

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

function Servicio({ id, inversa, icono, chip, titulo, texto, items, cierre, mensaje, fotos }) {
  return (
    <section className={`seccion servicio ${inversa ? 'servicio--inversa' : ''}`} id={id}>
      <div className="contenedor servicio__rejilla">
        <div className="servicio__fotos">
          <figure className="foto servicio__principal" data-parallax>
            <img src={fotos[0].src} alt={fotos[0].alt} width={fotos[0].width} height={fotos[0].height} loading="lazy" />
          </figure>
          <figure className="foto servicio__inserto" data-flotar>
            <img src={fotos[1].src} alt={fotos[1].alt} width={fotos[1].width} height={fotos[1].height} loading="lazy" />
          </figure>
        </div>
        <div className="servicio__texto">
          <Chip>
            <Icono nombre={icono} /> {chip}
          </Chip>
          <h2 data-titulo>{titulo}</h2>
          <p>{texto}</p>
          <Lista items={items} />
          <p className="servicio__cierre">{cierre}</p>
          <BotonWA texto="Hablar con un experto" mensaje={mensaje} />
        </div>
      </div>
    </section>
  )
}

export default function Servicios() {
  return (
    <>
      <Servicio
        id="servicios"
        icono="solar_power"
        chip="Fotovoltaico"
        titulo="Diseño e instalación de sistemas solares fotovoltaicos"
        texto="Soluciones integrales en energía solar, desde el diseño hasta la puesta en marcha de sistemas fotovoltaicos adaptados a hogares, empresas e instituciones, garantizando eficiencia, seguridad y cumplimiento normativo."
        items={fotovoltaico}
        cierre="Reduce costos energéticos y dependencia de la red eléctrica."
        mensaje="Hola Soltherra, quiero información sobre sistemas solares fotovoltaicos."
        fotos={[
          {
            src: '/img/trabajo-cubierta-blanca.webp',
            alt: 'Paneles solares y soportes sobre una cubierta clara',
            width: 1000,
            height: 1333,
          },
          {
            src: '/img/inversor.webp',
            alt: 'Inversor solar instalado en pared con canalización eléctrica',
            width: 1000,
            height: 1333,
          },
        ]}
      />
      <Servicio
        id="termico"
        inversa
        icono="thermostat"
        chip="Térmico"
        titulo="Diseño e instalación de sistemas solares térmicos"
        texto="Diseñamos e instalamos sistemas solares térmicos para el aprovechamiento eficiente de la radiación solar, ofreciendo soluciones sostenibles para climatización y calentamiento de agua en hogares, empresas e instituciones."
        items={termico}
        cierre="Ahorro energético sostenible con confort térmico continuo."
        mensaje="Hola Soltherra, quiero información sobre sistemas solares térmicos."
        fotos={[
          {
            src: '/img/colectores.webp',
            alt: 'Colectores solares térmicos de tubos al vacío instalados junto a una casa',
            width: 1600,
            height: 1200,
          },
          { src: '/img/tanque.webp', alt: 'Calentador solar de agua con tanque sobre una terraza', width: 900, height: 1200 },
        ]}
      />
    </>
  )
}

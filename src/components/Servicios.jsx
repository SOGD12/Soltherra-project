import { Icono } from './Iconos.jsx'
import { BotonWA, Chip } from './Comunes.jsx'
import fotosServicio from '../data/imagenes/servicios.json'
import { fotovoltaico, termico, piscina, cargaEV, mantenimiento, tramites } from '../data/contenido.js'

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

function Servicio({ id, inversa, panoramica, icono, chip, titulo, texto, items, cierre, mensaje, fotos }) {
  return (
    <section className={`seccion servicio ${inversa ? 'servicio--inversa' : ''} ${panoramica ? 'servicio--panoramica' : ''}`} id={id}>
      <div className="contenedor servicio__rejilla">
        <div className="servicio__fotos">
          <figure className="foto servicio__principal" data-parallax>
            <img src={fotos[0].foto} alt={fotos[0].alt} width={fotos[0].ancho} height={fotos[0].alto} loading="lazy" />
          </figure>
          <figure className="foto servicio__inserto" data-flotar>
            <img src={fotos[1].foto} alt={fotos[1].alt} width={fotos[1].ancho} height={fotos[1].alto} loading="lazy" />
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
      <section className="seccion servicios__intro" id="servicios" aria-labelledby="t-servicios">
        <div className="contenedor titulo-seccion">
          <Chip>Servicios</Chip>
          <h2 id="t-servicios" data-titulo>
            Todo lo que hacemos con <em className="acento">energía solar</em>
          </h2>
        </div>
      </section>
      <Servicio
        id="fotovoltaico"
        icono="solar_power"
        chip="Fotovoltaico"
        titulo="Diseño e instalación de sistemas solares fotovoltaicos"
        texto="Soluciones integrales en energía solar, desde el diseño hasta la puesta en marcha de sistemas fotovoltaicos adaptados a hogares, empresas e instituciones, garantizando eficiencia, seguridad y cumplimiento normativo."
        items={fotovoltaico}
        cierre="Reduce costos energéticos y dependencia de la red eléctrica."
        mensaje="Hola Soltherra, quiero información sobre sistemas solares fotovoltaicos."
        fotos={fotosServicio['fotovoltaico']}
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
        fotos={fotosServicio['termico']}
      />
      <Servicio
        id="piscina"
        panoramica
        icono="pool"
        chip="Climatización de piscina"
        titulo="Climatización de piscinas con energía solar"
        texto="Calentamos tu piscina aprovechando el sol: sistemas solares térmicos dimensionados para tu piscina, con instalación completa y puesta en marcha."
        items={piscina}
        cierre="Disfruta tu piscina todo el año con energía limpia."
        mensaje="Hola Soltherra, quiero información sobre climatización de piscina con energía solar."
        fotos={fotosServicio['piscina']}
      />
      <Servicio
        id="carga-ev"
        inversa
        icono="ev_station"
        chip="Carga de vehículos eléctricos"
        titulo="Puestos de carga para vehículos eléctricos"
        texto="Instalamos puestos de carga para tu vehículo eléctrico en casa, edificio, empresa o parqueadero, y los podemos alimentar con tu propio sistema solar para moverte con energía limpia."
        items={cargaEV}
        cierre="Carga tu vehículo con el sol y gasta menos en cada recorrido."
        mensaje="Hola Soltherra, quiero información sobre puestos de carga para vehículos eléctricos."
        fotos={fotosServicio['carga-ev']}
      />
      <Servicio
        id="mantenimiento"
        icono="build"
        chip="Mantenimiento"
        titulo="Mantenimiento preventivo y correctivo"
        texto="Mantenemos tu sistema solar funcionando como el primer día: revisamos, medimos y corregimos para que siga rindiendo y cuidando tu inversión."
        items={mantenimiento}
        cierre="Un sistema bien cuidado rinde más y dura más."
        mensaje="Hola Soltherra, quiero información sobre mantenimiento de mi sistema solar."
        fotos={fotosServicio['mantenimiento']}
      />
      <Servicio
        id="tramites"
        inversa
        icono="receipt_long"
        chip="Trámites y beneficios"
        titulo="Trámites y beneficios tributarios"
        texto="La ley colombiana premia a quien invierte en energía solar. Te acompañamos ante las entidades para que tu proyecto acceda a los incentivos tributarios que le corresponden."
        items={tramites}
        cierre="Menos impuestos y una inversión que se paga más rápido."
        mensaje="Hola Soltherra, quiero información sobre trámites y beneficios tributarios."
        fotos={fotosServicio['tramites']}
      />
    </>
  )
}

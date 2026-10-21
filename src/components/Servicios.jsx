import { fotovoltaico, termico, wa } from '../data/contenido.js'
import { IconoWhatsApp } from './Iconos.jsx'

function Lista({ items }) {
  return (
    <ul className="filas">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
}

export default function Servicios() {
  return (
    <>
      <section className="seccion servicio servicio--fv" id="servicios">
        <div className="contenedor servicio__rejilla">
          <div className="servicio__fotos">
            <figure className="foto foto--ancha">
              <img
                src="/img/instalacion.webp"
                alt="Dos técnicos instalando módulos fotovoltaicos sobre una cubierta"
                width="1200"
                height="667"
                loading="lazy"
              />
            </figure>
            <figure className="foto foto--cuadrada servicio__inserto">
              <img
                src="/img/inversor.webp"
                alt="Inversor solar instalado en pared con canalización eléctrica"
                width="1000"
                height="1333"
                loading="lazy"
              />
            </figure>
          </div>
          <div className="servicio__texto">
            <h2>Diseño e instalación de sistemas solares fotovoltaicos</h2>
            <p>
              Soluciones integrales en energía solar, desde el diseño hasta la puesta en marcha de sistemas
              fotovoltaicos adaptados a hogares, empresas e instituciones, garantizando eficiencia, seguridad y
              cumplimiento normativo.
            </p>
            <Lista items={fotovoltaico} />
            <p className="servicio__cierre">Reduce costos energéticos y dependencia de la red eléctrica.</p>
            <a
              className="boton boton--viva"
              href={wa('Hola Soltherra, quiero información sobre sistemas solares fotovoltaicos.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconoWhatsApp />
              <span>Hablar con un experto</span>
            </a>
          </div>
        </div>
      </section>

      <section className="seccion servicio servicio--termico">
        <div className="contenedor servicio__rejilla servicio__rejilla--inversa">
          <div className="servicio__texto">
            <h2>Diseño e instalación de sistemas solares térmicos</h2>
            <p>
              Diseñamos e instalamos sistemas solares térmicos para el aprovechamiento eficiente de la radiación
              solar, ofreciendo soluciones sostenibles para climatización y calentamiento de agua en hogares,
              empresas e instituciones.
            </p>
            <Lista items={termico} />
            <p className="servicio__cierre">Ahorro energético sostenible con confort térmico continuo.</p>
            <a
              className="boton"
              href={wa('Hola Soltherra, quiero información sobre sistemas solares térmicos.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconoWhatsApp />
              <span>Hablar con un experto</span>
            </a>
          </div>
          <div className="servicio__fotos">
            <figure className="foto foto--ancha">
              <img
                src="/img/colectores.webp"
                alt="Colectores solares térmicos de tubos al vacío instalados junto a una casa"
                width="1600"
                height="1200"
                loading="lazy"
              />
            </figure>
            <figure className="foto foto--cuadrada servicio__inserto">
              <img
                src="/img/tanque.webp"
                alt="Calentador solar de agua con tanque sobre una terraza"
                width="900"
                height="1200"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      <figure className="franja foto" data-revelar>
        <img
          src="/img/piscina.webp"
          alt="Piscina en una finca con una estructura de colectores solares térmicos sobre la terraza"
          width="1600"
          height="640"
          decoding="async"
        />
      </figure>
    </>
  )
}

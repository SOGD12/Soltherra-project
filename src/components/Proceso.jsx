import { Icono } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import { pasos } from '../data/contenido.js'

export default function Proceso() {
  return (
    <section className="seccion proceso" id="proceso" aria-labelledby="t-proceso">
      <div className="contenedor">
        <div className="titulo-seccion titulo-seccion--fila">
          <div>
            <Chip>Proceso</Chip>
            {/* Las palabras van en cajas para que el CSS las haga subir una a una (ver .pal en index.css) */}
            <h2 id="t-proceso" data-palabras>
              <span className="pal" style={{ '--i': 0 }}>
                <span>Cómo</span>
              </span>{' '}
              <em className="acento">
                <span className="pal" style={{ '--i': 1 }}>
                  <span>trabajamos</span>
                </span>
              </em>
            </h2>
          </div>
          <p>Te acompañamos desde la ingeniería hasta la puesta en marcha, y después del arranque también.</p>
        </div>
        <div className="pasos__caja">
          <span className="pasos__linea" aria-hidden="true">
            <span />
          </span>
          <ol className="pasos">
            {pasos.map((p, i) => (
              <li key={p.titulo}>
                <span className="pasos__marca">
                  <Icono nombre={p.icono} />
                </span>
                <span className="pasos__n" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

import { Icono } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import { beneficios } from '../data/contenido.js'

export default function Beneficios() {
  return (
    <section className="seccion beneficios" id="beneficios">
      <div className="contenedor beneficios__rejilla">
        <div className="beneficios__titulo">
          <Chip>Beneficios</Chip>
          <h2 data-titulo>
            Por qué pasarte al <em className="acento">sol</em>
          </h2>
        </div>
        <ul className="beneficios__lista">
          {beneficios.map((b) => (
            <li key={b.texto} data-fila>
              <span className="beneficios__icono">
                <Icono nombre={b.icono} />
              </span>
              <span>{b.texto}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

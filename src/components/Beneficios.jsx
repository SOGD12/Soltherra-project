import { beneficios } from '../data/contenido.js'

export default function Beneficios() {
  return (
    <section className="seccion beneficios" id="beneficios">
      <div className="contenedor beneficios__rejilla">
        <h2>Beneficios</h2>
        <ul className="beneficios__lista">
          {beneficios.map((b) => (
            <li key={b}>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

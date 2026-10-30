import { Icono } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import { gestiones } from '../data/contenido.js'

export default function Gestiones() {
  return (
    <section className="seccion-isla" id="gestiones" aria-labelledby="t-gestiones">
      <div className="isla gestiones" data-isla>
        <span className="isla__brillo" aria-hidden="true" />
        <div className="contenedor gestiones__rejilla">
          <div className="titulo-seccion">
            <Chip claro>Ingeniería y trámites</Chip>
            <h1 id="t-gestiones" data-titulo>
              Lo técnico y el papeleo, <em className="acento">resueltos</em> por Soltherra
            </h1>
            <p>Nos encargamos de la parte técnica y de los trámites para que tu sistema opere con respaldo normativo.</p>
          </div>
          <ul className="gestiones__lista">
            {gestiones.map((g) => (
              <li key={g.titulo}>
                <span className="gestiones__icono">
                  <Icono nombre={g.icono} />
                </span>
                <h3>{g.titulo}</h3>
                <p>{g.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

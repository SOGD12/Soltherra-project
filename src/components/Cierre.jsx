import { Icono } from './Iconos.jsx'
import { BotonWA, Chip } from './Comunes.jsx'
import { nav } from '../data/contenido.js'

// Cierre de Inicio: lleva a las otras páginas del menú (sin repetir Inicio ni Contacto) y deja el WhatsApp a mano.
const destinos = nav.filter(([, href]) => href !== '/home' && href !== '/contacto')

export default function Cierre() {
  return (
    <section className="seccion cierre" aria-labelledby="t-cierre">
      <div className="contenedor">
        <div className="cierre__cabeza">
          <div>
            <Chip>Sigue explorando</Chip>
            <h2 id="t-cierre">
              Conoce más de <em className="acento">Soltherra</em>
            </h2>
          </div>
          <BotonWA texto="Cotizar por WhatsApp" />
        </div>
        <ul className="cierre__lista">
          {destinos.map(([etiqueta, href]) => (
            <li key={href}>
              <a className="cierre__enlace" href={href}>
                <span>{etiqueta}</span>
                <span className="cierre__flecha" aria-hidden="true">
                  <Icono nombre="arrow_outward" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

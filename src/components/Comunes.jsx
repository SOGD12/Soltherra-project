import { IconoWhatsApp } from './Iconos.jsx'
import { wa, MENSAJE } from '../data/contenido.js'

export function BotonWA({ texto, mensaje = MENSAJE, variante = '', corto = false }) {
  return (
    <a
      className={`boton ${variante} ${corto ? 'boton--corto' : ''}`.trim()}
      href={wa(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconoWhatsApp />
      <span>{texto}</span>
    </a>
  )
}

/** Cierre de sección: invitación a hablar con un experto por WhatsApp, con un mensaje propio de cada sección. */
export function LlamadaExperto({ titulo, texto, boton, mensaje }) {
  return (
    <section className="experto-seccion">
      <div className="contenedor">
        <div className="experto">
          <div className="experto__texto">
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </div>
          <BotonWA texto={boton} mensaje={mensaje} variante="boton--viva" />
        </div>
      </div>
    </section>
  )
}

export function Chip({ children, claro = false }) {
  return <p className={`chip ${claro ? 'chip--claro' : ''}`.trim()}>{children}</p>
}

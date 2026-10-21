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

export function Chip({ children, claro = false }) {
  return <p className={`chip ${claro ? 'chip--claro' : ''}`.trim()}>{children}</p>
}

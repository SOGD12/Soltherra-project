import { Icono } from './Iconos.jsx'
import { cinta } from '../data/contenido.js'

export default function Cinta() {
  // La lista va dos veces para que el bucle sea continuo; la copia se oculta a lectores de pantalla.
  const grupo = (copia) => (
    <ul className="cinta__grupo" aria-hidden={copia || undefined}>
      {cinta.map((t) => (
        <li key={t}>
          <Icono nombre="light_mode" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="cinta" id="cinta" aria-label="Lo que hacemos">
      <div className="cinta__pista">
        {grupo(false)}
        {grupo(true)}
      </div>
    </div>
  )
}

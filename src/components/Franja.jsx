

import inicio from '../data/imagenes/inicio.json'

export default function Franja() {
  return (
    <figure className="franja" data-franja>
      <img
        src={inicio.franja.foto}
        alt={inicio.franja.alt}
        width={inicio.franja.ancho}
        height={inicio.franja.alto}
        loading="lazy"
        decoding="async"
      />
      <figcaption className="contenedor">
        <span>Climatización de piscinas con energía solar térmica</span>
      </figcaption>
    </figure>
  )
}

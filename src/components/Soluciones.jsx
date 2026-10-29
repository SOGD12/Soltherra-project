import { Icono } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import { soluciones } from '../data/contenido.js'
import fotos from '../data/imagenes/soluciones.json'

export default function Soluciones() {
  return (
    <section className="seccion soluciones" id="soluciones" aria-labelledby="t-soluciones">
      <div className="contenedor">
        <div className="titulo-seccion">
          <Chip>Soluciones</Chip>
          <h2 id="t-soluciones" data-titulo>
            Explora lo que el <em className="acento">sol</em> puede hacer por ti
          </h2>
        </div>
        <div className="bento">
          {soluciones.map((s) => {
            const f = fotos[s.imagen]
            return (
            <a key={s.titulo} className={`bento__tarjeta ${s.clase}`} href={s.href}>
              <img src={f.foto} alt={f.alt} width={f.ancho} height={f.alto} loading="lazy" decoding="async" />
              <span className="bento__velo" aria-hidden="true" />
              <span className="bento__titulo">{s.titulo}</span>
              <span className="bento__flecha" aria-hidden="true">
                <Icono nombre="arrow_outward" />
              </span>            </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

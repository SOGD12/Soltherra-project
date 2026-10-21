import { useEffect, useState } from 'react'
import { obtenerTrabajos, trabajosIniciales } from '../api/trabajos.js'

export default function Trabajos() {
  const [trabajos, setTrabajos] = useState(trabajosIniciales)

  useEffect(() => {
    let activo = true
    obtenerTrabajos().then((d) => activo && setTrabajos(d))
    return () => {
      activo = false
    }
  }, [])

  useEffect(() => {
    // Obras que llegan después de la carga inicial (API real) no pasan por el observador: se muestran ya visibles.
    if (trabajos === trabajosIniciales) return
    document.querySelectorAll('.trabajos [data-sube]').forEach((el) => el.classList.add('visto'))
  }, [trabajos])

  return (
    <section className="seccion trabajos" id="trabajos">
      <div className="contenedor">
        <div className="trabajos__encabezado" data-sube>
          <h2>Nuestros trabajos</h2>
          <p>Instalaciones de sistemas solares fotovoltaicos y térmicos realizadas por Soltherra.</p>
        </div>
        <div className="trabajos__rejilla">
          {trabajos.map((t, i) => (
            <figure key={t.id} className={`trabajo trabajo--${t.posicion}`} data-sube style={{ '--i': i % 3 }}>
              <div className="trabajo__foto foto">
                <img src={t.foto} alt={t.alt} width={t.ancho} height={t.alto} loading="lazy" />
              </div>
              <figcaption>
                {t.cliente && <strong>{t.cliente}</strong>}
                {t.titulo}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

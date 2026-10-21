import { useEffect, useRef, useState } from 'react'
import { Icono } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import { categorias } from '../data/contenido.js'
import { obtenerTrabajos, trabajosIniciales } from '../api/trabajos.js'
import { sinMovimiento } from '../movimiento.js'

const INTERVALO = 3000

function useVisibles() {
  const calc = () =>
    window.matchMedia('(min-width: 900px)').matches ? 3 : window.matchMedia('(min-width: 640px)').matches ? 2 : 1
  const [n, setN] = useState(calc)
  useEffect(() => {
    const qs = [window.matchMedia('(min-width: 900px)'), window.matchMedia('(min-width: 640px)')]
    const f = () => setN(calc())
    qs.forEach((m) => m.addEventListener('change', f))
    return () => qs.forEach((m) => m.removeEventListener('change', f))
  }, [])
  return n
}

export default function Trabajos() {
  const [trabajos, setTrabajos] = useState(trabajosIniciales)
  const [categoria, setCategoria] = useState('fotovoltaico')
  const [indice, setIndice] = useState(0)
  const [pausa, setPausa] = useState(false)
  const [enVista, setEnVista] = useState(false)
  const visibles = useVisibles()
  const caja = useRef(null)
  const reducido = typeof window !== 'undefined' && sinMovimiento()

  useEffect(() => {
    let activo = true
    obtenerTrabajos().then((d) => activo && setTrabajos(d))
    return () => {
      activo = false
    }
  }, [])

  const lista = trabajos.filter((t) => t.categoria === categoria)
  const maximo = Math.max(lista.length - visibles, 0)
  const posicion = Math.min(indice, maximo)
  const automatico = !reducido && !pausa && enVista && maximo > 0

  // Solo avanza sola cuando la sección está a la vista, sin el cursor ni el foco encima y con la pestaña activa.
  useEffect(() => {
    const el = caja.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!automatico) return
    const id = setTimeout(() => {
      if (!document.hidden) setIndice(posicion >= maximo ? 0 : posicion + 1)
    }, INTERVALO)
    return () => clearTimeout(id)
  }, [automatico, posicion, maximo, categoria])

  const elegir = (c) => {
    setCategoria(c)
    setIndice(0)
  }
  const mover = (d) => setIndice(posicion + d < 0 ? maximo : posicion + d > maximo ? 0 : posicion + d)

  return (
    <section className="seccion trabajos" id="trabajos">
      <div className="contenedor">
        <div className="titulo-seccion titulo-seccion--fila">
          <div>
            <Chip>Obras reales</Chip>
            <h2 data-titulo>
              Nuestros <em className="acento">trabajos</em>
            </h2>
          </div>
          <p>Elige el tipo de instalación y mira las obras realizadas por Soltherra.</p>
        </div>
        <div className="trabajos__barra">
          <div className="pestanas" role="tablist" aria-label="Tipo de trabajo">
            {categorias.map(([clave, texto, icono]) => (
              <button
                key={clave}
                type="button"
                role="tab"
                id={`tab-${clave}`}
                aria-selected={categoria === clave}
                aria-controls="carrusel"
                className="pestanas__boton"
                onClick={() => elegir(clave)}
              >
                <Icono nombre={icono} />
                <span>{texto}</span>
              </button>
            ))}
          </div>
          <div className="carrusel__flechas">
            <button type="button" onClick={() => mover(-1)} aria-label="Trabajo anterior">
              <Icono nombre="arrow_back" />
            </button>
            <button type="button" onClick={() => mover(1)} aria-label="Trabajo siguiente">
              <Icono nombre="arrow_forward" />
            </button>
          </div>
        </div>
        <div
          id="carrusel"
          ref={caja}
          className="carrusel"
          role="tabpanel"
          aria-labelledby={`tab-${categoria}`}
          aria-roledescription="carrusel"
          style={{ '--v': visibles, '--i': posicion }}
          onMouseEnter={() => setPausa(true)}
          onMouseLeave={() => setPausa(false)}
          onFocus={() => setPausa(true)}
          onBlur={() => setPausa(false)}
          onTouchStart={() => setPausa(true)}
          onTouchEnd={() => setPausa(false)}
        >
          <div className="carrusel__ventana">
            <ul className="carrusel__pista">
              {lista.map((t, k) => {
                const dentro = k >= posicion && k < posicion + visibles
                return (
                  <li key={t.id} className="tarjeta" aria-hidden={!dentro} inert={!dentro}>
                    <img src={t.foto} alt={t.alt} width={t.ancho} height={t.alto} loading="lazy" decoding="async" />
                    <span className="tarjeta__velo" aria-hidden="true" />
                    <div className="tarjeta__texto">
                      <h3>{t.titulo}</h3>
                      {t.cliente && <p>{t.cliente}</p>}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="carrusel__puntos" role="group" aria-label="Elegir trabajo">
            {Array.from({ length: maximo + 1 }, (_, k) => (
              <button
                key={k}
                type="button"
                aria-label={`Ir al trabajo ${k + 1}`}
                aria-current={k === posicion}
                data-auto={automatico && k === posicion ? 'si' : undefined}
                onClick={() => setIndice(k)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

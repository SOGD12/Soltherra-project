import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Icono } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import { categorias } from '../data/contenido.js'
import { obtenerTrabajos, trabajosIniciales } from '../api/trabajos.js'
import { sinMovimiento } from '../movimiento.js'

const INTERVALO = 3000

const calcVisibles = () =>
  window.matchMedia('(min-width: 900px)').matches ? 3 : window.matchMedia('(min-width: 640px)').matches ? 2 : 1
const suscribirAncho = (aviso) => {
  const qs = [window.matchMedia('(min-width: 900px)'), window.matchMedia('(min-width: 640px)')]
  qs.forEach((m) => m.addEventListener('change', aviso))
  return () => qs.forEach((m) => m.removeEventListener('change', aviso))
}

// En el servidor (HTML pre-renderizado) y al hidratar vale 3; después se ajusta al ancho real.
const useVisibles = () => useSyncExternalStore(suscribirAncho, calcVisibles, () => 3)

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
  // Deslizar con el dedo (o el ratón): la pista sigue al puntero y al soltar pasa al trabajo vecino si se movió lo bastante.
  const toque = useRef(null)
  const [arrastre, setArrastre] = useState(0)
  const [arrastrando, setArrastrando] = useState(false)
  const empezarArrastre = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    toque.current = { x: e.clientX, ancho: e.currentTarget.clientWidth, dx: 0, activo: false }
  }
  const moverArrastre = (e) => {
    const t = toque.current
    if (!t) return
    const dx = e.clientX - t.x
    if (!t.activo && Math.abs(dx) < 8) return
    if (!t.activo) e.currentTarget.setPointerCapture?.(e.pointerId) // si el puntero sale de la ventana sigue llegando pointerup
    t.activo = true
    // Sin hueco más allá del primero y el último: el borde se resiste.
    const tope = (posicion === 0 && dx > 0) || (posicion === maximo && dx < 0)
    t.dx = tope ? dx / 4 : dx
    setArrastrando(true)
    setArrastre(t.dx)
  }
  const terminarArrastre = () => {
    const t = toque.current
    toque.current = null
    if (!t?.activo) return
    const umbral = Math.min(60, t.ancho / 5)
    if (t.dx < -umbral) setIndice(Math.min(posicion + 1, maximo))
    else if (t.dx > umbral) setIndice(Math.max(posicion - 1, 0))
    setArrastre(0)
    setArrastrando(false)
  }
  // Patrón de pestañas: flechas, Inicio y Fin cambian de pestaña y mueven el foco
  const teclasPestana = (e) => {
    const k = categorias.findIndex(([c]) => c === categoria)
    const n = categorias.length
    const nuevo = { ArrowRight: (k + 1) % n, ArrowLeft: (k - 1 + n) % n, Home: 0, End: n - 1 }[e.key]
    if (nuevo === undefined) return
    e.preventDefault()
    elegir(categorias[nuevo][0])
    document.getElementById(`tab-${categorias[nuevo][0]}`)?.focus()
  }
  const mover = (d) => setIndice(posicion + d < 0 ? maximo : posicion + d > maximo ? 0 : posicion + d)

  return (
    <section className="seccion trabajos" id="trabajos">
      <div className="contenedor">
        <div className="titulo-seccion titulo-seccion--fila">
          <div>
            <Chip>Obras reales</Chip>
            <h1 data-titulo>
              Nuestros <em className="acento">trabajos</em>
            </h1>
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
                tabIndex={categoria === clave ? 0 : -1}
                onKeyDown={teclasPestana}
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
          style={{ '--v': visibles, '--i': posicion, '--dx': `${arrastre}px` }}
          data-arrastrando={arrastrando || undefined}
          onMouseEnter={() => setPausa(true)}
          onMouseLeave={() => setPausa(false)}
          onFocus={() => setPausa(true)}
          onBlur={() => setPausa(false)}
          onTouchStart={() => setPausa(true)}
          onTouchEnd={() => setPausa(false)}
        >
          <div
            className="carrusel__ventana"
            onPointerDown={empezarArrastre}
            onPointerMove={moverArrastre}
            onPointerUp={terminarArrastre}
            onPointerCancel={terminarArrastre}
          >
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

import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs/animation'
import { sinMovimiento } from '../movimiento.js'
import { infografias } from '../data/contenido.js'

// Pestañas: una por tipo de sistema (Fotovoltaico, Térmico); cada una muestra todas sus infografías.
const grupos = [...new Set(infografias.map((i) => i.grupo))]
const idGrupo = (g) => g.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export default function Infografias() {
  const [grupo, setGrupo] = useState(grupos[0])
  const items = infografias.filter((i) => i.grupo === grupo)
  const imagenes = useRef(null)
  const primera = useRef(true)
  const visor = useRef(null)
  // Clave de la infografía ampliada (null = visor cerrado)
  const [abierta, setAbierta] = useState(null)
  const actual = infografias.find((i) => i.clave === abierta) ?? items[0]
  // Zoom con gestos (solo pantallas táctiles): pellizcar para ampliar, arrastrar para moverse, doble toque para alternar.
  const [vista, setVista] = useState({ s: 1, x: 0, y: 0 })
  const lienzo = useRef(null)
  const punteros = useRef(new Map())
  const gesto = useRef(null)
  const ultimoToque = useRef(0)

  // Visor: <dialog> modal nativo (Esc cierra, el foco queda dentro y vuelve al botón al cerrar).
  useEffect(() => {
    const d = visor.current
    if (!d) return
    if (abierta && !d.open) d.showModal()
    if (!abierta && d.open) d.close()
    document.body.classList.toggle('sin-scroll', Boolean(abierta))
    return () => document.body.classList.remove('sin-scroll')
  }, [abierta])
  const cerrar = () => {
    setAbierta(null)
    setVista({ s: 1, x: 0, y: 0 })
    punteros.current.clear()
    gesto.current = null
  }
  const limitar = (v) => {
    const r = lienzo.current?.getBoundingClientRect()
    const s = Math.min(Math.max(v.s, 1), 4)
    if (!r || s === 1) return { s, x: 0, y: 0 }
    const mx = (r.width * (s - 1)) / 2
    const my = (r.height * (s - 1)) / 2
    return { s, x: Math.min(Math.max(v.x, -mx), mx), y: Math.min(Math.max(v.y, -my), my) }
  }
  const distancia = () => {
    const [a, b] = [...punteros.current.values()]
    return Math.hypot(a.x - b.x, a.y - b.y)
  }
  const alBajar = (e) => {
    if (e.pointerType === 'mouse') return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* el puntero ya terminó: no hace falta capturarlo */
    }
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (punteros.current.size === 2) gesto.current = { d: distancia(), vista }
    else if (punteros.current.size === 1) {
      gesto.current = { px: e.clientX, py: e.clientY, vista }
      const ahora = Date.now()
      if (ahora - ultimoToque.current < 300) setVista((v) => limitar(v.s > 1 ? { s: 1, x: 0, y: 0 } : { s: 2.5, x: 0, y: 0 }))
      ultimoToque.current = ahora
    }
  }
  const alMover = (e) => {
    if (!punteros.current.has(e.pointerId)) return
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const g = gesto.current
    if (!g) return
    if (punteros.current.size === 2 && g.d) setVista(limitar({ ...g.vista, s: g.vista.s * (distancia() / g.d) }))
    else if (punteros.current.size === 1 && g.vista && g.vista.s > 1)
      setVista(limitar({ ...g.vista, x: g.vista.x + e.clientX - g.px, y: g.vista.y + e.clientY - g.py }))
  }
  const alSoltar = (e) => {
    punteros.current.delete(e.pointerId)
    gesto.current = punteros.current.size === 1 ? { px: [...punteros.current.values()][0].x, py: [...punteros.current.values()][0].y, vista } : null
  }

  // Al cambiar de pestaña las infografías entran desde un lado creciendo.
  useEffect(() => {
    if (primera.current) {
      primera.current = false
      return
    }
    if (sinMovimiento()) return
    const a = animate(imagenes.current, {
      opacity: [0, 1],
      x: [48, 0],
      scale: [0.94, 1],
      duration: 900,
      ease: 'outQuart',
    })
    return () => a.cancel?.()
  }, [grupo])

  // Patrón de pestañas: flechas, Inicio y Fin cambian de pestaña y mueven el foco
  const teclas = (e) => {
    const k = grupos.indexOf(grupo)
    const n = grupos.length
    const nuevo = { ArrowRight: (k + 1) % n, ArrowLeft: (k - 1 + n) % n, Home: 0, End: n - 1 }[e.key]
    if (nuevo === undefined) return
    e.preventDefault()
    setGrupo(grupos[nuevo])
    document.getElementById(`info-tab-${idGrupo(grupos[nuevo])}`)?.focus()
  }

  return (
    <section className="seccion infografias" id="equipos">
      <div className={`contenedor infografias__rejilla ${items.length > 1 ? 'infografias__rejilla--varias' : ''}`}>
        <div className="infografias__texto">
          <h2 data-titulo>
            Así funciona nuestro <em className="acento">sistema</em>
          </h2>
          <div className="pestanas" role="tablist" aria-label="Tipo de sistema">
            {grupos.map((g) => (
              <button
                key={g}
                type="button"
                role="tab"
                id={`info-tab-${idGrupo(g)}`}
                aria-selected={grupo === g}
                aria-controls="info-panel"
                tabIndex={grupo === g ? 0 : -1}
                onKeyDown={teclas}
                className="pestanas__boton"
                onClick={() => setGrupo(g)}
              >
                <span>{g}</span>
              </button>
            ))}
          </div>
        </div>
        <figure id="info-panel" className="infografias__marco" role="tabpanel" aria-labelledby={`info-tab-${idGrupo(grupo)}`}>
          <div ref={imagenes} key={grupo} className={`infografias__imagenes ${items.length > 1 ? 'infografias__imagenes--varias' : ''}`}>
            {items.map((i) => (
              <div key={i.clave} className={`infografias__tarjeta ${i.foto_completa ? 'infografias__tarjeta--foto' : ''}`}>
                <button type="button" className="infografias__abrir" onClick={() => setAbierta(i.clave)} aria-label={`Ampliar: ${i.titulo}`}>
                  <img src={i.foto} alt={i.alt} width={i.ancho} height={i.alto} loading="lazy" decoding="async" />
                </button>
              </div>
            ))}
          </div>
        </figure>
        <dialog ref={visor} className="visor" aria-label={actual.titulo} onClose={cerrar} onClick={(e) => e.target === visor.current && cerrar()}>
          <div className="visor__caja">
            <div className="visor__barra">
              <strong>{actual.titulo}</strong>
              <div className="visor__acciones">
                <button type="button" onClick={cerrar} autoFocus>
                  Cerrar
                </button>
              </div>
            </div>
            <div
              ref={lienzo}
              className="visor__lienzo"
              onPointerDown={alBajar}
              onPointerMove={alMover}
              onPointerUp={alSoltar}
              onPointerCancel={alSoltar}
            >
              <img
                src={actual.foto}
                alt={actual.alt}
                width={actual.ancho}
                height={actual.alto}
                draggable={false}
                style={{ transform: `translate(${vista.x}px, ${vista.y}px) scale(${vista.s})` }}
              />
            </div>
          </div>
        </dialog>
      </div>
    </section>
  )
}

import { Fragment, useEffect, useRef, useState } from 'react'
import { animate } from 'animejs/animation'
import { sinMovimiento } from '../movimiento.js'
import { Chip } from './Comunes.jsx'
import { infografias } from '../data/contenido.js'

export default function Infografias() {
  const [clave, setClave] = useState(infografias[0].clave)
  const actual = infografias.find((i) => i.clave === clave)
  const foto = useRef(null)
  const frase = useRef(null)
  const primera = useRef(true)
  const visor = useRef(null)
  const [abierta, setAbierta] = useState(false)
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
    document.body.classList.toggle('sin-scroll', abierta)
    return () => document.body.classList.remove('sin-scroll')
  }, [abierta])
  const cerrar = () => {
    setAbierta(false)
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

  // Al cambiar de pestaña la infografía entra desde un lado creciendo, y la frase sube con un fundido.
  useEffect(() => {
    if (primera.current) {
      primera.current = false
      return
    }
    if (sinMovimiento()) return
    const a = animate(foto.current, {
      opacity: [0, 1],
      x: [48, 0],
      scale: [0.94, 1],
      duration: 900,
      ease: 'outQuart',
    })
    const b = animate(frase.current, { opacity: [0, 1], y: [14, 0], duration: 700, ease: 'outQuart' })
    return () => {
      a.cancel?.()
      b.cancel?.()
    }
  }, [clave])

  // Patrón de pestañas: flechas, Inicio y Fin cambian de pestaña y mueven el foco
  const teclas = (e) => {
    const k = infografias.findIndex((i) => i.clave === clave)
    const n = infografias.length
    const nuevo = { ArrowRight: (k + 1) % n, ArrowLeft: (k - 1 + n) % n, Home: 0, End: n - 1 }[e.key]
    if (nuevo === undefined) return
    e.preventDefault()
    setClave(infografias[nuevo].clave)
    document.getElementById(`info-tab-${infografias[nuevo].clave}`)?.focus()
  }

  return (
    <section className="seccion infografias" id="equipos">
      <div className="contenedor infografias__rejilla">
        <div className="infografias__texto">
          <Chip>Nuestros equipos</Chip>
          <h2 data-titulo>
            Equipos para cada <em className="acento">sistema</em>
          </h2>
          <div className="pestanas" role="tablist" aria-label="Tipo de sistema">
            {infografias.map((i, k) => (
              <Fragment key={i.clave}>
                {(k === 0 || infografias[k - 1].grupo !== i.grupo) && (
                  <span className="pestanas__grupo" role="presentation">
                    {i.grupo}
                  </span>
                )}
                <button
                  type="button"
                  role="tab"
                  id={`info-tab-${i.clave}`}
                  aria-selected={clave === i.clave}
                  aria-controls="info-panel"
                  tabIndex={clave === i.clave ? 0 : -1}
                  onKeyDown={teclas}
                  className="pestanas__boton"
                  onClick={() => setClave(i.clave)}
                >
                  <span>{i.pestana}</span>
                </button>
              </Fragment>
            ))}
          </div>
          <p ref={frase} className="infografias__frase" aria-live="polite">
            <strong>{actual.titulo}:</strong> {actual.texto}
          </p>
        </div>
        <figure id="info-panel" className="infografias__marco" role="tabpanel" aria-labelledby={`info-tab-${clave}`}>
          <button type="button" className="infografias__abrir" onClick={() => setAbierta(true)} aria-label={`Ampliar: ${actual.titulo}`}>
            <img
              ref={foto}
              key={actual.clave}
              src={actual.foto}
              alt={actual.alt}
              width={actual.ancho}
              height={actual.alto}
              loading="lazy"
              decoding="async"
            />
          </button>
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

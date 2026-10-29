import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Icono } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import { historia } from '../data/contenido.js'
import { sinMovimiento } from '../movimiento.js'
import { gama } from '../rendimiento.js'

// Pantallas táctiles: el dedo en vertical sobre la casa hace scroll y en horizontal la gira (ver escena.js).
const esTactil = () => window.matchMedia('(pointer: coarse)').matches
const sinSuscripcion = () => () => {}

export default function Recorrido() {
  const seccion = useRef(null)
  const lienzo = useRef(null)
  const [paso, setPaso] = useState(0)
  const [lista, setLista] = useState(false)
  const [girando, setGirando] = useState(false)
  const escenaRef = useRef(null)
  // En el servidor (HTML pre-renderizado) y al hidratar vale false; después refleja el dispositivo real.
  const tactil = useSyncExternalStore(sinSuscripcion, esTactil, () => false)

  useEffect(() => {
    let vivo = true
    let escena = null
    let marco = 0
    let io = null
    const reducido = sinMovimiento()

    const medir = () => {
      marco = 0
      const el = seccion.current
      if (!el || !escena) return
      const r = el.getBoundingClientRect()
      const recorrido = r.height - window.innerHeight
      const p = recorrido > 0 ? Math.min(Math.max(-r.top / recorrido, 0), 1) : 1
      escena.progreso(p)
      el.style.setProperty('--avance', p.toFixed(4))
      setPaso(Math.min(historia.length - 1, Math.floor(p * historia.length * 0.999)))
    }
    const alScroll = () => {
      if (!marco) marco = requestAnimationFrame(medir)
    }

    import('../escena.js').then(({ crearEscena }) => {
      if (!vivo || !lienzo.current) return
      escena = crearEscena(lienzo.current, { reducido, tactil: esTactil(), baja: gama() === 'baja' })
      escenaRef.current = escena
      setLista(true)
      if (reducido) return
      medir()
      window.addEventListener('scroll', alScroll, { passive: true })
      window.addEventListener('resize', alScroll)
      io = new IntersectionObserver(([e]) => escena.reproducir(e.isIntersecting))
      io.observe(seccion.current)
    })

    return () => {
      vivo = false
      cancelAnimationFrame(marco)
      window.removeEventListener('scroll', alScroll)
      window.removeEventListener('resize', alScroll)
      io?.disconnect()
      escena?.destruir()
      escenaRef.current = null
    }
  }, [])

  const alternarGiro = () => {
    const nuevo = !girando
    setGirando(nuevo)
    escenaRef.current?.girar(nuevo)
  }

  return (
    <section className="recorrido" id="recorrido" ref={seccion} aria-labelledby="t-recorrido">
      <div className="recorrido__fijo">
        <div className="contenedor recorrido__rejilla">
          <div className="recorrido__texto">
            <Chip claro>Cómo funciona</Chip>
            <h2 id="t-recorrido" data-titulo>
              Del <em className="acento">sol</em> a tu casa
            </h2>
            <ol className="recorrido__pasos">
              {historia.map((h, i) => (
                <li key={h.titulo} aria-current={i === paso ? 'step' : undefined} data-visto={i <= paso || undefined}>
                  <span className="recorrido__icono">
                    <Icono nombre={h.icono} />
                  </span>
                  <div>
                    <h3>{h.titulo}</h3>
                    <p>{h.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <figure className="recorrido__escena" data-lista={lista || undefined}>
            <canvas
              ref={lienzo}
              role="img"
              aria-label="Escena en 3D: el sol ilumina el panel solar del techo, la energía pasa por el inversor y se encienden las ventanas de la casa"
            />
            {tactil ? (
              // En el celular la casa solo se gira con el dedo después de tocar este botón, para que un roce al hacer scroll no la mueva.
              <button type="button" className="recorrido__girar" aria-pressed={girando} onClick={alternarGiro}>
                <Icono nombre="rotate_360" /> {girando ? 'Desliza la casa · Toca para soltar' : 'Toca para girar la casa'}
              </button>
            ) : (
              <figcaption>
                <Icono nombre="rotate_360" /> Arrastra para girar la casa
              </figcaption>
            )}
          </figure>
        </div>
        <span className="recorrido__barra" aria-hidden="true" />
      </div>
    </section>
  )
}

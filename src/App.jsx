import { useEffect, useRef } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Cinta from './components/Cinta.jsx'
import Nosotros from './components/Nosotros.jsx'
import MisionVision from './components/MisionVision.jsx'
import Soluciones from './components/Soluciones.jsx'
import Cierre from './components/Cierre.jsx'
import Gestiones from './components/Gestiones.jsx'
import Servicios from './components/Servicios.jsx'
import Recorrido from './components/Recorrido.jsx'
import Proceso from './components/Proceso.jsx'
import Franja from './components/Franja.jsx'
import Trabajos from './components/Trabajos.jsx'
import Beneficios from './components/Beneficios.jsx'
import Contacto from './components/Contacto.jsx'
import { LlamadaExperto } from './components/Comunes.jsx'
import Pie from './components/Pie.jsx'
import useProgresoScroll from './hooks/useProgresoScroll.js'
import useAnimaciones from './hooks/useAnimaciones.js'
import useRuta from './ruta.js'
import { aplicarSeo } from './seo.js'

// Cada pestaña del menú es una página: solo se monta lo suyo, así no carga todo en un mismo lugar.
const PAGINAS = {
  inicio: () => (
    <>
      <Hero />
      <Cinta />
      <Nosotros />
      <MisionVision />
      <Soluciones />
      <Cierre />
    </>
  ),
  servicios: () => (
    <>
      <Gestiones />
      <Servicios />
    </>
  ),
  'como-funciona': () => (
    <>
      <Recorrido />
      <Proceso />
      <Franja />
      <LlamadaExperto
        titulo="¿Quieres ver cómo quedaría en tu casa o empresa?"
        texto="Un experto de Soltherra te explica el proceso paso a paso y resuelve tus dudas."
        boton="Hablar con un experto"
        mensaje="Hola Soltherra, vi la sección «Cómo funciona» de su página y quiero hablar con un experto para que me expliquen cómo sería el proceso en mi caso."
      />
    </>
  ),
  trabajos: () => (
    <>
      <Trabajos />
      <Beneficios />
      <LlamadaExperto
        titulo="¿Te gustó alguno de estos trabajos?"
        texto="Cuéntanos qué tienes en mente y un experto te da más información y una cotización."
        boton="Pedir información"
        mensaje="Hola Soltherra, vi sus trabajos en la página y quiero más información sobre el servicio. ¿Me puede asesorar un experto?"
      />
    </>
  ),
  contacto: () => <Contacto />,
}

export default function App() {
  const { pagina, ancla } = useRuta()
  const Pagina = PAGINAS[pagina]

  useProgresoScroll()
  useAnimaciones(pagina)

  // Al cambiar de pestaña se vuelve arriba (o se baja al bloque pedido) y se actualiza el título, la descripción y el canonical.
  const anterior = useRef(pagina)
  useEffect(() => {
    aplicarSeo(pagina)
    const destino = ancla && document.getElementById(ancla)
    let reanclar = () => {}
    if (destino) {
      destino.scrollIntoView({ behavior: 'instant' })
      // Fuentes, imágenes y títulos animados cambian el alto de lo que hay encima mientras carga la página:
      // se vuelve a colocar el bloque durante un instante, salvo que la persona ya haya empezado a moverse.
      const ir = () => destino.scrollIntoView({ behavior: 'instant' })
      const ro = new ResizeObserver(ir)
      ro.observe(document.body)
      const parar = () => ro.disconnect()
      const id = setTimeout(parar, 2000)
      const eventos = ['wheel', 'touchstart', 'keydown', 'pointerdown']
      eventos.forEach((e) => window.addEventListener(e, parar, { passive: true, once: true }))
      reanclar = () => {
        clearTimeout(id)
        parar()
        eventos.forEach((e) => window.removeEventListener(e, parar))
      }
    } else window.scrollTo({ top: 0, behavior: 'instant' })
    // Al cambiar de página el <main> se vuelve a crear: se le pasa el foco para que teclado y lector de pantalla
    // sigan desde el contenido nuevo (y anuncien el título) en vez de quedar en el vacío.
    if (anterior.current !== pagina) {
      anterior.current = pagina
      document.getElementById('contenido')?.focus({ preventScroll: true })
    }
    return reanclar
  }, [pagina, ancla])

  return (
    <>
      <Header pagina={pagina} />
      <main id="contenido" tabIndex={-1} key={pagina}>
        <Pagina />
      </main>
      <Pie />
    </>
  )
}

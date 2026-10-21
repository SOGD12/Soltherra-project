import { animate } from 'animejs/animation'
import { createScope } from 'animejs/scope'
import { onScroll } from 'animejs/events'
import { stagger } from 'animejs/utils'
import { splitText } from 'animejs/text'

const sinMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Todos los observadores de scroll, para recalcular sus posiciones si la página cambia de alto.
let observadores = []
const observar = (opciones) => {
  const o = onScroll(opciones)
  observadores.push(o)
  return o
}
const todos = (sel) => [...document.querySelectorAll(sel)]

// Entrada única: el grupo arranca cuando su referencia entra en pantalla.
function alEntrar(objetivos, referencia, { y = 40, delay = 80, duracion = 900, x, escala } = {}) {
  const els = todos(objetivos)
  const ref = document.querySelector(referencia)
  if (!els.length || !ref) return
  animate(els, {
    opacity: [0, 1],
    ...(x === undefined ? { y: [y, 0] } : { x: [x, 0] }),
    ...(escala ? { scale: [escala, 1] } : {}),
    duration: duracion,
    delay: stagger(delay),
    ease: 'outExpo',
    autoplay: observar({ target: ref, enter: 'bottom-=10% top', repeat: false }),
  })
}

// Atado al scroll: la animación avanza y retrocede con la posición de la página.
const atado = (target, enter = 'end start', leave = 'start end') => observar({ target, enter, leave, sync: 0.35 })

export function iniciarAnimaciones() {
  if (sinMovimiento()) {
    document.documentElement.classList.add('animado')
    return () => {}
  }
  const escritorio = window.matchMedia('(min-width: 900px)').matches
  const textos = []
  observadores = []

  const ambito = createScope().add(() => {
    // ---------- Hero: titular palabra a palabra, foto con zoom lento y salida atada al scroll ----------
    const titulo = document.querySelector('.hero__titulo')
    if (titulo) {
      const partido = splitText(titulo, { words: { wrap: 'clip' } })
      textos.push(partido)
      document.documentElement.classList.add('animado')
      animate(partido.words, { y: ['110%', '0%'], duration: 1100, delay: stagger(70, { start: 150 }), ease: 'outExpo' })
    }
    animate('.hero .chip, .hero__sub, .hero__acciones, .hero__bajar', {
      opacity: [0, 1],
      y: [24, 0],
      duration: 1000,
      delay: stagger(120, { start: 600 }),
      ease: 'outExpo',
    })
    animate('.hero__foto', { scale: [1.18, 1.04], duration: 2600, ease: 'outQuart' })
    animate('.hero__medio', { y: ['0%', '22%'], ease: 'linear', autoplay: atado('.hero', 'start start', 'end start') })
    animate('.hero__texto', {
      y: [0, -90],
      opacity: [1, 0],
      ease: 'linear',
      autoplay: atado('.hero', 'start start', 'end start'),
    })

    // ---------- Títulos de sección: las palabras suben desde un recorte ----------
    todos('[data-titulo]').forEach((h) => {
      const partido = splitText(h, { words: { wrap: 'clip' } })
      textos.push(partido)
      animate(partido.words, {
        y: ['105%', '0%'],
        duration: 900,
        delay: stagger(55),
        ease: 'outExpo',
        autoplay: observar({ target: h, enter: 'bottom-=8% top', repeat: false }),
      })
    })

    // ---------- Párrafos que se "llenan" de tinta palabra a palabra al hacer scroll ----------
    todos('[data-llenar]').forEach((p) => {
      const partido = splitText(p, { words: true })
      textos.push(partido)
      animate(partido.words, {
        opacity: [0.16, 1],
        delay: stagger(40),
        ease: 'linear',
        autoplay: atado(p, 'end-=8% start', 'center+=10% end'),
      })
    })

    // ---------- Fotos con paralaje ----------
    todos('[data-parallax] img').forEach((img) => {
      animate(img, { y: ['-9%', '9%'], scale: [1.18, 1.18], ease: 'linear', autoplay: atado(img.parentElement) })
    })
    todos('[data-flotar]').forEach((f) => {
      animate(f, { y: [70, -40], rotate: [-4, 2], ease: 'linear', autoplay: atado(f) })
    })

    // ---------- Islas oscuras: crecen desde una tarjeta hasta casi todo el ancho ----------
    todos('[data-isla]').forEach((isla) => {
      animate(isla, {
        scale: [0.9, 1],
        borderRadius: ['64px', escritorio ? '36px' : '28px'],
        ease: 'linear',
        autoplay: atado(isla, 'end start', 'start+=35% end'),
      })
    })
    animate('.isla__brillo', { scale: [0.85, 1.15], opacity: [0.55, 0.9], duration: 4200, loop: true, alternate: true, ease: 'inOutSine' })

    // ---------- Entradas únicas ----------
    alEntrar('.nosotros__texto .chip, .nosotros__texto > p:not(.destacado), .para-quien li', '.nosotros', { y: 24, delay: 70 })
    alEntrar('.bento__tarjeta', '.bento', { y: 60, delay: 110, duracion: 1100, escala: 0.94 })
    alEntrar('.gestiones__lista li', '.gestiones__lista', { y: 40, delay: 110 })
    alEntrar('.servicio .filas li', '.servicio .filas', { x: -24, delay: 80 })
    alEntrar('.pasos li', '.pasos', { y: 36, delay: 140 })
    alEntrar('.carrusel', '.carrusel', { y: 40, duracion: 1000 })
    alEntrar('.contacto dl > div, .contacto__mapa, .formulario', '.contacto__rejilla', { y: 40, delay: 110 })

    // ---------- Proceso: la línea se dibuja con el scroll ----------
    animate('.pasos__linea span', {
      ...(escritorio ? { scaleX: [0, 1] } : { scaleY: [0, 1] }),
      ease: 'linear',
      autoplay: atado('.pasos', 'end-=10% start', 'center center'),
    })

    // ---------- Franja de la piscina: se abre de tarjeta a pantalla completa ----------
    const franja = document.querySelector('[data-franja]')
    if (franja) {
      animate(franja, {
        clipPath: ['inset(0% 9% 0% 9% round 40px)', 'inset(0% 0% 0% 0% round 0px)'],
        ease: 'linear',
        autoplay: atado(franja, 'end start', 'center center'),
      })
      animate(franja.querySelector('img'), { scale: [1.25, 1], ease: 'linear', autoplay: atado(franja, 'end start', 'end end') })
    }

    // ---------- Beneficios: cada fila se ilumina al pasar por el centro ----------
    todos('[data-fila]').forEach((fila) => {
      animate(fila, {
        opacity: [0.2, 1],
        x: [escritorio ? 60 : 24, 0],
        ease: 'linear',
        autoplay: atado(fila, 'end start', 'center+=15% end'),
      })
    })

    // ---------- Pie: el nombre gigante sube mientras aparece ----------
    animate('.pie__gigante', { y: ['40%', '0%'], ease: 'linear', autoplay: atado('.pie', 'end start', 'end end') })
  })

  // Las fuentes y las imágenes terminan de cargar después: al cambiar el alto de la página se recalcula todo.
  // Se refresca el contenedor (la ventana), que mide de nuevo su alto y luego cada observador.
  const recalcular = () => new Set(observadores.map((o) => o.container)).forEach((c) => c.refresh())
  let alto = document.documentElement.scrollHeight
  let espera = 0
  const ro = new ResizeObserver(() => {
    const nuevo = document.documentElement.scrollHeight
    if (nuevo === alto) return
    alto = nuevo
    clearTimeout(espera)
    espera = setTimeout(recalcular, 120)
  })
  ro.observe(document.body)
  document.fonts?.ready.then(recalcular)

  return () => {
    ro.disconnect()
    clearTimeout(espera)
    ambito.revert()
    textos.forEach((t) => t.revert())
    document.documentElement.classList.remove('animado')
  }
}

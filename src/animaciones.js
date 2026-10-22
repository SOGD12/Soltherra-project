import { animate } from 'animejs/animation'
import { createScope } from 'animejs/scope'
import { onScroll } from 'animejs/events'
import { stagger } from 'animejs/utils'
import { splitText } from 'animejs/text'
import { sinMovimiento } from './movimiento.js'
import { gama } from './rendimiento.js'

// Todos los observadores de scroll, para recalcular sus posiciones si la página cambia de alto.
let observadores = []
const observar = (opciones) => {
  const o = onScroll(opciones)
  observadores.push(o)
  return o
}
const todos = (sel) => [...document.querySelectorAll(sel)]

// Ritmo de las entradas: multiplica todas las duraciones y retrasos (más alto = más lento y suave).
// El fundido de celular tiene su propio tiempo en index.css (--duracion-fundido).
const LENTITUD = 1.45
const t = (ms) => Math.round(ms * LENTITUD)
// 'outQuart' frena de forma más gradual que 'outExpo', que arranca muy rápido y parece brusco.
const SUAVE = 'outQuart'

// Entrada única: el grupo arranca cuando su referencia entra en pantalla.
function alEntrar(objetivos, referencia, { y = 40, delay = 80, duracion = 900, x, escala } = {}) {
  const els = todos(objetivos)
  const ref = document.querySelector(referencia)
  if (!els.length || !ref) return
  animate(els, {
    opacity: [0, 1],
    ...(x === undefined ? { y: [y, 0] } : { x: [x, 0] }),
    ...(escala ? { scale: [escala, 1] } : {}),
    duration: t(duracion),
    delay: stagger(t(delay)),
    ease: SUAVE,
    autoplay: observar({ target: ref, enter: 'bottom-=10% top', repeat: false }),
  })
}

// Atado al scroll: la animación avanza y retrocede con la posición de la página.
// En celular el suavizado (sync) mantiene el motor activo en cada fotograma: se usa uno más corto.
const ligero = () => window.matchMedia('(max-width: 899px), (pointer: coarse)').matches
const atado = (target, enter = 'end start', leave = 'start end') =>
  observar({ target, enter, leave, sync: ligero() ? 0.12 : 0.35 })

export function iniciarAnimaciones() {
  if (sinMovimiento()) {
    document.documentElement.classList.add('animado')
    return () => {}
  }
  // En celular solo llevan animaciones de JavaScript el inicio, "Cómo funciona" (la casa) y "Cómo trabajamos".
  // Beneficios no lleva ninguna y Contacto solo un fundido en el título; el resto entra con un fundido de CSS
  // (ver fundir). El escritorio las lleva todas.
  const movil = ligero()
  const conserva = (el) => !movil || el.closest('#recorrido, #proceso')
  // Equipos de baja gama: en las partes que sí se animan se omiten además las atadas al scroll.
  const recortar = movil && gama() === 'baja'
  const textos = []
  observadores = []

  // ---------- Fundido ligero (celular): opacidad y desplazamiento con CSS, una sola vez al entrar ----------
  // El navegador lo resuelve en la tarjeta gráfica, sin motor de animación. Al terminar se quitan las marcas
  // para que el elemento recupere sus propias transiciones de CSS.
  const marcados = []
  const quitar = (el) => {
    el.removeAttribute('data-fade')
    el.removeAttribute('data-pal')
    el.classList.remove('visto')
    el.style.removeProperty('--retraso')
    el.style.removeProperty('--desplazar')
    el.style.removeProperty('--duracion-fundido')
  }
  // Algunos grupos entran juntos: se observa un elemento de referencia y, al llegar, todos reciben .visto a la vez.
  const grupos = new Map()
  const vistos = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((e) => {
        if (!e.isIntersecting) return
        vistos.unobserve(e.target)
        ;(grupos.get(e.target) ?? [e.target]).forEach((el) => el.classList.add('visto'))
      }),
    { rootMargin: '0px 0px -6% 0px' },
  )
  // paso: retraso entre elementos (ms). referencia: elemento que dispara a todo el grupo.
  // desplazar y duracion cambian el recorrido y el tiempo del fundido (por defecto, los de index.css).
  const fundir = (els, paso = 0, { referencia, desplazar, duracion } = {}) => {
    els.forEach((el, i) => {
      el.dataset.fade = ''
      el.style.setProperty('--retraso', `${i * paso}ms`)
      if (desplazar) el.style.setProperty('--desplazar', desplazar)
      if (duracion) el.style.setProperty('--duracion-fundido', duracion)
      const limpiar = (e) => {
        if (e.target !== el || e.propertyName !== 'opacity' || !el.classList.contains('visto')) return
        el.removeEventListener('transitionend', limpiar)
        quitar(el)
      }
      el.addEventListener('transitionend', limpiar)
      marcados.push(el)
      if (!referencia) vistos.observe(el)
    })
    if (referencia && els.length) {
      grupos.set(referencia, els)
      vistos.observe(referencia)
    }
  }

  // Títulos con las palabras ya separadas en el marcado (data-palabras): el CSS las hace subir una a una.
  // Aquí solo se les indica cuándo empezar.
  todos('[data-palabras]').forEach((h) => {
    h.setAttribute('data-pal', '')
    marcados.push(h)
    vistos.observe(h)
  })

  // Las fotos de "Soluciones" son grandes: se descargan y decodifican con anticipación, cuando la sección
  // aún está a un par de pantallas, para que no se decodifiquen justo mientras empieza la animación de entrada.
  const precarga = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((e) => {
        if (!e.isIntersecting) return
        precarga.unobserve(e.target)
        e.target.querySelectorAll('img').forEach((img) => {
          img.loading = 'eager'
          img.decode?.().catch(() => {})
        })
      }),
    { rootMargin: '150% 0px' },
  )
  todos('.bento').forEach((el) => precarga.observe(el))

  const ambito = createScope().add(() => {
    // ---------- Hero: titular palabra a palabra, foto con zoom lento y salida atada al scroll ----------
    const titulo = document.querySelector('.hero__titulo')
    if (titulo) {
      const partido = splitText(titulo, { words: { wrap: 'clip' } })
      textos.push(partido)
      document.documentElement.classList.add('animado')
      animate(partido.words, { y: ['110%', '0%'], duration: t(1100), delay: stagger(t(70), { start: t(150) }), ease: SUAVE })
    }
    animate('.hero .chip, .hero__sub, .hero__acciones, .hero__bajar', {
      opacity: [0, 1],
      y: [24, 0],
      duration: t(1000),
      delay: stagger(t(120), { start: t(600) }),
      ease: SUAVE,
    })
    animate('.hero__foto', { scale: [1.18, 1.04], duration: t(2600), ease: 'outQuart' })
    if (!recortar) {
      animate('.hero__medio', { y: ['0%', '22%'], ease: 'linear', autoplay: atado('.hero', 'start start', 'end start') })
      animate('.hero__texto', {
        y: [0, -90],
        opacity: [1, 0],
        ease: 'linear',
        autoplay: atado('.hero', 'start start', 'end start'),
      })
    }

    // ---------- Títulos de sección: las palabras suben desde un recorte (en celular, solo en las secciones que se conservan) ----------
    todos('[data-titulo]').forEach((h) => {
      // En celular Beneficios queda sin animación y Contacto solo hace fundido en el título.
      if (!conserva(h)) return h.closest('#beneficios') ? undefined : fundir([h])
      const partido = splitText(h, { words: { wrap: 'clip' } })
      textos.push(partido)
      animate(partido.words, {
        y: ['105%', '0%'],
        duration: t(900),
        delay: stagger(t(55)),
        ease: SUAVE,
        autoplay: observar({ target: h, enter: 'bottom-=8% top', repeat: false }),
      })
    })

    if (movil) {
      // ---------- Celular: lo que en escritorio se anima con JavaScript aquí entra con un fundido ----------
      fundir(todos('.nosotros__texto .chip, .nosotros__texto > p:not(.destacado), .para-quien li'), 70)
      fundir(todos('[data-llenar]'))
      fundir(todos('[data-parallax], [data-flotar]'))
      fundir(todos('.bento__tarjeta'), 80)
      fundir(todos('.gestiones__lista li'))
      fundir(todos('.servicio .filas li'))
      fundir(todos('.carrusel, [data-franja]'))
    } else {
      // ---------- Párrafos que se "llenan" de tinta palabra a palabra al hacer scroll ----------
      todos('[data-llenar]').forEach((p) => {
        const partido = splitText(p, { words: true })
        textos.push(partido)
        animate(partido.words, {
          opacity: [0.3, 1],
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
        // Solo escala: el radio de las esquinas queda fijo en CSS, porque animarlo obliga a repintar todo el bloque.
        animate(isla, {
          scale: [0.9, 1],
          ease: 'linear',
          autoplay: atado(isla, 'end start', 'start+=35% end'),
        })
      })

      // ---------- Entradas únicas ----------
      alEntrar('.nosotros__texto .chip, .nosotros__texto > p:not(.destacado), .para-quien li', '.nosotros', { y: 24, delay: 70 })
      alEntrar('.bento__tarjeta', '.bento', { y: 60, delay: 110, duracion: 1100, escala: 0.94 })
      alEntrar('.gestiones__lista li', '.gestiones__lista', { y: 40, delay: 110 })
      alEntrar('.servicio .filas li', '.servicio .filas', { x: -24, delay: 80 })
      alEntrar('.carrusel', '.carrusel', { y: 40, duracion: 1000 })

      // ---------- Franja de la piscina: se abre de tarjeta a pantalla completa ----------
      const franja = document.querySelector('[data-franja]')
      if (franja) {
        // Escala en vez de clip-path: el recorte no lo acelera la GPU y repintaba la foto en cada fotograma.
        animate(franja, { scale: [0.86, 1], ease: 'linear', autoplay: atado(franja, 'end start', 'center center') })
        animate(franja.querySelector('img'), { scale: [1.25, 1], ease: 'linear', autoplay: atado(franja, 'end start', 'end end') })
      }

      // ---------- Beneficios: cada fila se ilumina al pasar por el centro ----------
      todos('[data-fila]').forEach((fila) => {
        animate(fila, {
          opacity: [0.2, 1],
          x: [60, 0],
          ease: 'linear',
          autoplay: atado(fila, 'end start', 'center+=15% end'),
        })
      })

      // ---------- Pie: el nombre gigante sube mientras aparece ----------
      animate('.pie__gigante', { y: ['40%', '0%'], ease: 'linear', autoplay: atado('.pie', 'end start', 'end end') })
    }

    // Contacto solo se anima en escritorio
    if (!movil) alEntrar('.contacto dl > div, .contacto__mapa, .formulario', '.contacto__rejilla', { y: 40, delay: 110 })
  })

  // ---------- Proceso: solo CSS, en todos los equipos ----------
  // Las tarjetas entran juntas, una tras otra, cuando la lista llega a pantalla (mismo recorrido y ritmo que
  // tenía con Anime.js). El título y la línea que se dibuja con el scroll están resueltos en index.css.
  fundir(todos('.pasos li'), t(140), { referencia: document.querySelector('.pasos'), desplazar: '36px', duracion: `${t(900)}ms` })

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
    precarga.disconnect()
    vistos.disconnect()
    marcados.forEach(quitar)
    ro.disconnect()
    clearTimeout(espera)
    ambito.revert()
    textos.forEach((t) => t.revert())
    document.documentElement.classList.remove('animado')
  }
}

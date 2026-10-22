// Clasifica el equipo en 'alta' o 'baja' gama para decidir cuántas animaciones se activan.
//  - Escritorio: siempre 'alta'.
//  - Celular o tableta: 'baja' si ahorra datos, tiene poca memoria o pocos núcleos, o si una prueba corta
//    de dibujo (la misma clase de trabajo que hace la escena 3D) tarda más que UMBRAL_MS.
// Para probar un caso concreto sin cambiar el código: abrir la página con ?gama=baja o ?gama=alta.
// El resultado queda en <html data-gama data-gama-ms> para poder calibrar el umbral en un equipo real.

// Milisegundos por pasada de la prueba. En un escritorio da ~0,3; un celular de gama media suele dar de 5 a 10 veces más.
const UMBRAL_MS = 1.5

const esCelular = () => window.matchMedia('(max-width: 899px), (pointer: coarse)').matches

function prueba() {
  const lienzo = document.createElement('canvas')
  lienzo.width = lienzo.height = 360
  // willReadFrequently obliga a pintar con el procesador, que es lo que hace Zdog y donde se nota un equipo lento.
  const c = lienzo.getContext('2d', { willReadFrequently: true })
  const pasada = () => {
    for (let i = 0; i < 200; i++) {
      const x = (i * 37) % 300
      const y = (i * 53) % 300
      c.beginPath()
      c.moveTo(x, y)
      c.lineTo(x + 50, y + 10)
      c.lineTo(x + 40, y + 60)
      c.lineTo(x - 5, y + 45)
      c.closePath()
      c.fillStyle = `hsl(${i}, 60%, 50%)`
      c.fill()
      c.lineWidth = 3
      c.strokeStyle = '#123'
      c.stroke()
    }
  }
  pasada() // calentamiento: la primera pasada incluye compilar el código
  const inicio = performance.now()
  for (let k = 0; k < 5; k++) pasada()
  return (performance.now() - inicio) / 5
}

let resultado = null

export function gama() {
  if (resultado) return resultado
  const forzada = new URLSearchParams(window.location.search).get('gama')
  let ms = 0
  if (forzada === 'alta' || forzada === 'baja') {
    resultado = forzada
  } else if (!esCelular()) {
    resultado = 'alta'
  } else {
    ms = prueba()
    const ahorro = navigator.connection?.saveData === true
    const poca = (navigator.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4
    resultado = ahorro || poca || ms > UMBRAL_MS ? 'baja' : 'alta'
  }
  document.documentElement.dataset.gama = resultado
  document.documentElement.dataset.gamaMs = ms.toFixed(2)
  return resultado
}

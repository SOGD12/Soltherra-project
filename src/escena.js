import Zdog from 'zdog'

// Escena 3D (Zdog) del recorrido sol → panel → inversor → casa.
// Todo depende de un progreso de 0 a 1 que llega desde el scroll; el tiempo solo mueve
// detalles en bucle (rayos del sol, cargas de energía, balanceo suave).

const { TAU } = Zdog
const C = {
  sol: '#fdb62e',
  solSuave: '#ffd27a',
  celda: '#1f6aa5',
  marco: '#f2f8fb',
  muro: '#f2f8fb',
  muroSombra: '#c9dbe7',
  muroFondo: '#a9c2d3',
  techo: '#187a41',
  techoSombra: '#146636',
  ventana: '#16486b',
  puerta: '#0b3b5a',
  suelo: '#0f4a6f',
  sendero: '#1a5a82',
  hoja: '#3bb86a',
  hojaOscura: '#187a41',
  tronco: '#7a5233',
  cable: '#c4d7e3',
  led: '#3bb86a',
  ledApagado: '#4a6275',
}

const limitar = (n) => Math.min(Math.max(n, 0), 1)
const tramo = (p, a, b) => limitar((p - a) / (b - a))
const suave = (t) => t * t * (3 - 2 * t)
const mezclar = (a, b, t) => {
  const x = parseInt(a.slice(1), 16)
  const y = parseInt(b.slice(1), 16)
  const c = (s) => Math.round(((x >> s) & 255) + (((y >> s) & 255) - ((x >> s) & 255)) * t)
  return `#${((1 << 24) | (c(16) << 16) | (c(8) << 8) | c(0)).toString(16).slice(1)}`
}
const lerp3 = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t })

// Punto sobre el faldón delantero del techo: u recorre el ancho (x), v sube del alero a la cumbrera.
const ALERO = { y: 0, z: 66 }
const CUMBRE = { y: -64, z: 0 }
const sobreTecho = (x, v, lift = 3) => ({
  x,
  y: ALERO.y + (CUMBRE.y - ALERO.y) * v - lift * 0.707,
  z: ALERO.z + (CUMBRE.z - ALERO.z) * v + lift * 0.707,
})

function punteroEnRecorrido(puntos, t) {
  const largos = puntos.slice(1).map((p, i) => Math.hypot(p.x - puntos[i].x, p.y - puntos[i].y, p.z - puntos[i].z))
  let resto = t * largos.reduce((a, b) => a + b, 0)
  for (let i = 0; i < largos.length; i++) {
    if (resto <= largos[i]) return lerp3(puntos[i], puntos[i + 1], largos[i] ? resto / largos[i] : 0)
    resto -= largos[i]
  }
  return puntos[puntos.length - 1]
}

export function crearEscena(canvas, { reducido = false, tactil = false } = {}) {
  const illo = new Zdog.Illustration({
    element: canvas,
    resize: true,
    rotate: { x: -TAU / 22, y: -TAU / 10 },
    translate: { y: 10 },
    onResize(ancho, alto) {
      this.zoom = Math.min(ancho / 500, alto / 460)
    },
  })
  // Zdog dibuja a la densidad de píxeles del equipo (3x en muchos celulares). Por encima de 2x no se nota
  // la diferencia y el lienzo cuesta más del doble de pintar, así que se limita a 2x.
  illo.setSizeCanvas = function (ancho, alto) {
    const densidad = (this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2))
    this.width = ancho
    this.height = alto
    this.element.width = this.canvasWidth = ancho * densidad
    this.element.height = this.canvasHeight = alto * densidad
  }
  illo.setMeasuredSize()
  illo.onResize(illo.width, illo.height)

  // Orden de pintado: el suelo siempre al fondo; encima, "cosas" se ordena por profundidad.
  // La casa es un solo Group convexo con caras de una sola cara (backface: false): cada cara
  // se pinta solo cuando mira a la cámara, así el techo y los muros no se cruzan al girarla.
  const mundo = new Zdog.Group({ addTo: illo })

  // ---------- Suelo y sendero ----------
  new Zdog.Ellipse({ addTo: mundo, diameter: 520, translate: { y: 100 }, rotate: { x: TAU / 4 }, fill: true, stroke: 0, color: C.suelo })
  new Zdog.Rect({
    addTo: mundo,
    width: 34,
    height: 120,
    translate: { y: 99, z: 128 },
    rotate: { x: TAU / 4 },
    fill: true,
    stroke: 4,
    color: C.sendero,
  })

  const cosas = new Zdog.Group({ addTo: mundo, updateSort: true })

  // ---------- Árbol ----------
  const arbol = new Zdog.Anchor({ addTo: cosas, translate: { x: -170, y: 100, z: 40 } })
  new Zdog.Cylinder({ addTo: arbol, diameter: 14, length: 60, rotate: { x: TAU / 4 }, translate: { y: -30 }, color: C.tronco, stroke: false })
  new Zdog.Shape({ addTo: arbol, stroke: 78, translate: { y: -88 }, color: C.hojaOscura })
  new Zdog.Shape({ addTo: arbol, stroke: 56, translate: { x: -14, y: -112, z: 10 }, color: C.hoja })
  new Zdog.Shape({ addTo: arbol, stroke: 40, translate: { x: 16, y: -102, z: 18 }, color: C.hoja })

  // ---------- Casa ----------
  // Cara plana de una sola cara: `front` es la dirección hacia afuera.
  const cara = (addTo, path, front, color, stroke = 2) =>
    new Zdog.Shape({ addTo, path, front, closed: true, fill: true, stroke, color, backface: false })
  const casa = new Zdog.Group({ addTo: cosas })
  const W = 85
  const D = 62
  const H = 100

  // Muros: trasero, izquierdo, derecho (con su ventana) y fachada (con ventanas y puerta)
  cara(casa, [{ x: -W, y: 0, z: -D }, { x: W, y: 0, z: -D }, { x: W, y: H, z: -D }, { x: -W, y: H, z: -D }], { z: -1 }, C.muroFondo)
  cara(casa, [{ x: -W, y: 0, z: -D }, { x: -W, y: 0, z: D }, { x: -W, y: H, z: D }, { x: -W, y: H, z: -D }], { x: -1 }, C.muroSombra)
  const muroDerecho = cara(casa, [{ x: W, y: 0, z: -D }, { x: W, y: 0, z: D }, { x: W, y: H, z: D }, { x: W, y: H, z: -D }], { x: 1 }, C.muroSombra)
  const ventanaLateral = cara(
    casa,
    [{ x: W + 1, y: 30, z: -44 }, { x: W + 1, y: 30, z: -4 }, { x: W + 1, y: 58, z: -4 }, { x: W + 1, y: 58, z: -44 }],
    { x: 1 },
    C.ventana,
    3,
  )
  const fachada = cara(casa, [{ x: -W, y: 0, z: D }, { x: W, y: 0, z: D }, { x: W, y: H, z: D }, { x: -W, y: H, z: D }], { z: 1 }, C.muro)
  const ventanas = [
    new Zdog.Rect({ addTo: casa, width: 36, height: 30, translate: { x: -48, y: 46, z: D + 1 }, fill: true, stroke: 3, color: C.ventana, backface: false }),
    new Zdog.Rect({ addTo: casa, width: 36, height: 30, translate: { x: 48, y: 46, z: D + 1 }, fill: true, stroke: 3, color: C.ventana, backface: false }),
    ventanaLateral,
  ]
  new Zdog.Rect({ addTo: casa, width: 26, height: 46, translate: { y: 77, z: D + 1 }, fill: true, stroke: 3, color: C.puerta, backface: false })

  // Hastiales
  cara(casa, [{ x: -W, y: 0, z: -D }, { x: -W, y: CUMBRE.y, z: 0 }, { x: -W, y: 0, z: D }], { x: -1 }, C.muroSombra)
  cara(casa, [{ x: W, y: 0, z: -D }, { x: W, y: CUMBRE.y, z: 0 }, { x: W, y: 0, z: D }], { x: 1 }, C.muroSombra)

  // Faldones con alero: van después de muros y hastiales para cubrir sus bordes
  cara(
    casa,
    [{ x: -96, y: 4, z: -70 }, { x: 96, y: 4, z: -70 }, { x: 96, y: CUMBRE.y, z: 0 }, { x: -96, y: CUMBRE.y, z: 0 }],
    { y: -1, z: -1 },
    C.techoSombra,
    4,
  )
  const faldon = cara(
    casa,
    [
      { x: -96, y: ALERO.y + 4, z: ALERO.z + 4 },
      { x: 96, y: ALERO.y + 4, z: ALERO.z + 4 },
      { x: 96, y: CUMBRE.y, z: CUMBRE.z },
      { x: -96, y: CUMBRE.y, z: CUMBRE.z },
    ],
    { y: -1, z: 1 },
    C.techo,
    4,
  )

  // ---------- Panel solar sobre el faldón delantero (después del faldón, en el mismo grupo) ----------
  const COLS = 4
  const FILAS = 3
  const X0 = -70
  const X1 = 70
  const V0 = 0.12
  const V1 = 0.9
  const HACIA_SOL = { y: -1, z: 1 }
  cara(
    casa,
    [sobreTecho(X0 - 4, V0 - 0.05, 2), sobreTecho(X1 + 4, V0 - 0.05, 2), sobreTecho(X1 + 4, V1 + 0.05, 2), sobreTecho(X0 - 4, V1 + 0.05, 2)],
    HACIA_SOL,
    C.marco,
    4,
  )
  const celdas = []
  for (let f = 0; f < FILAS; f++) {
    for (let c = 0; c < COLS; c++) {
      const xa = X0 + ((X1 - X0) * c) / COLS + 2.5
      const xb = X0 + ((X1 - X0) * (c + 1)) / COLS - 2.5
      // f = 0 es la fila de arriba (cerca de la cumbrera)
      const va = V1 - ((V1 - V0) * f) / FILAS - 0.03
      const vb = V1 - ((V1 - V0) * (f + 1)) / FILAS + 0.03
      celdas.push(cara(casa, [sobreTecho(xa, va, 4), sobreTecho(xb, va, 4), sobreTecho(xb, vb, 4), sobreTecho(xa, vb, 4)], HACIA_SOL, C.celda, 1))
    }
  }

  // ---------- Inversor en el muro derecho y cable (grupo propio: queda detrás de la casa al girarla) ----------
  const equipo = new Zdog.Group({ addTo: cosas })
  new Zdog.Box({
    addTo: equipo,
    width: 6,
    height: 34,
    depth: 26,
    translate: { x: W + 4, y: 46, z: 30 },
    stroke: 2,
    color: C.marco,
    leftFace: false,
    rightFace: C.marco,
    backface: false,
  })
  const led = new Zdog.Shape({ addTo: equipo, stroke: 6, translate: { x: W + 8, y: 38, z: 30 }, color: C.ledApagado })
  const RECORRIDO = [sobreTecho(X1 + 2, V0, 6), { x: 96, y: 6, z: 64 }, { x: 96, y: 28, z: 64 }, { x: 93, y: 46, z: 44 }]
  new Zdog.Shape({ addTo: equipo, path: RECORRIDO, closed: false, stroke: 3, color: C.cable })
  const cargas = [0, 1, 2, 3].map(() => new Zdog.Shape({ addTo: equipo, stroke: 9, color: C.sol, visible: false }))

  // ---------- Sol: núcleo, aro y rayos siempre de frente a la cámara ----------
  // Sale detrás de la casa, por el horizonte, y sube hasta quedar frente al panel.
  const SOL_ALTO = { x: -150, y: -190, z: 130 }
  const SOL_BAJO = { x: -230, y: 70, z: -150 }
  const sol = new Zdog.Anchor({ addTo: cosas, translate: { ...SOL_BAJO } })
  const frenteSol = new Zdog.Anchor({ addTo: sol })
  const aro = new Zdog.Ellipse({ addTo: frenteSol, diameter: 104, stroke: 3, color: C.solSuave })
  const rayos = new Zdog.Anchor({ addTo: frenteSol })
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU
    new Zdog.Shape({
      addTo: rayos,
      path: [
        { x: Math.cos(a) * 64, y: Math.sin(a) * 64 },
        { x: Math.cos(a) * 80, y: Math.sin(a) * 80 },
      ],
      stroke: 7,
      color: C.sol,
    })
  }
  new Zdog.Shape({ addTo: sol, stroke: 82, color: C.sol })

  // Haces: del sol a la fila superior de celdas; su largo crece con el progreso.
  const destinos = [0, 1, 2, 3].map((c) => sobreTecho(X0 + ((X1 - X0) * (c + 0.5)) / COLS, V1 - 0.15, 6))
  const haces = destinos.map(
    () => new Zdog.Shape({ addTo: cosas, path: [{}, {}], stroke: 5, color: C.sol, visible: false }),
  )

  // ---------- Estado ----------
  let objetivo = reducido ? 1 : 0
  let progreso = objetivo
  let giroUsuario = 0
  let giroInicio = 0
  let giroSolo = false
  let marco = 0
  let activo = false
  let ultimo = 0
  const inicioTiempo = performance.now()
  // En celular el lienzo se dibuja a ~30 fps: la escena se ve igual de fluida y libera el scroll.
  const intervalo = tactil ? 1000 / 30 : 0

  // Con ratón se gira arrastrando sobre el lienzo. En pantallas táctiles el dedo sobre la casa
  // debe seguir bajando la página, así que el giro va por un botón (ver girar* abajo).
  if (!tactil) new Zdog.Dragger({
    startElement: canvas,
    onDragStart() {
      giroInicio = giroUsuario
      canvas.classList.add('arrastrando')
    },
    onDragMove(_p, dx) {
      giroUsuario = giroInicio - (dx / canvas.clientWidth) * TAU * 0.8
      if (!activo) dibujar(performance.now())
    },
    onDragEnd() {
      canvas.classList.remove('arrastrando')
    },
  })

  function dibujar(ahora) {
    const t = (ahora - inicioTiempo) / 1000
    const dt = ultimo ? Math.min((ahora - ultimo) / 1000, 0.1) : 0
    ultimo = ahora
    // Al soltar el botón la casa sigue girando sola, despacio.
    if (giroSolo && !reducido) giroUsuario += dt * 0.6
    progreso += (objetivo - progreso) * (reducido ? 1 : 0.1)
    const p = progreso

    // Cámara: gira de tres cuartos izquierdo a tres cuartos derecho mientras avanza la historia.
    const balanceo = reducido ? 0 : Math.sin(t * 0.5) * 0.04
    illo.rotate.y = -TAU / 9 + p * (TAU / 7) + balanceo + giroUsuario
    illo.rotate.x = -TAU / 22 - p * 0.08

    // 1. Sale el sol
    const subida = suave(tramo(p, 0, 0.22))
    Object.assign(sol.translate, lerp3(SOL_BAJO, SOL_ALTO, subida))
    frenteSol.rotate.y = -illo.rotate.y
    frenteSol.rotate.x = -illo.rotate.x
    rayos.rotate.z = reducido ? 0 : t * 0.35
    aro.scale = 1 + (reducido ? 0 : Math.sin(t * 2.4) * 0.08)

    // 2. Los haces se extienden hasta el panel
    const alcance = suave(tramo(p, 0.22, 0.42))
    haces.forEach((h, i) => {
      const d = limitar(alcance * 1.3 - i * 0.1)
      h.visible = d > 0.01 && p < 0.98
      if (!h.visible) return
      const a = sol.translate
      const fin = lerp3(a, destinos[i], d)
      h.path[0] = { x: a.x, y: a.y, z: a.z }
      h.path[1] = fin
      h.updatePath()
    })

    // 3. Se encienden las celdas, fila por fila
    const encendido = tramo(p, 0.36, 0.58)
    celdas.forEach((celda, i) => {
      const k = limitar(encendido * 1.6 - i * 0.05)
      const brillo = reducido ? 1 : 0.92 + Math.sin(t * 3 + i * 0.6) * 0.08
      celda.color = mezclar(C.celda, C.sol, k * brillo)
    })

    // 4. La energía baja por el cable al inversor
    const flujo = tramo(p, 0.56, 0.66)
    cargas.forEach((carga, i) => {
      carga.visible = flujo > 0
      if (!carga.visible) return
      const fase = reducido ? i / 4 : (t * 0.45 + i / 4) % 1
      Object.assign(carga.translate, punteroEnRecorrido(RECORRIDO, fase))
      carga.scale = flujo
    })
    led.color = flujo > 0.5 ? C.led : C.ledApagado

    // 5. La casa se enciende
    const luz = suave(tramo(p, 0.72, 0.9))
    ventanas.forEach((v, i) => {
      v.color = mezclar(C.ventana, C.sol, limitar(luz * 1.4 - i * 0.2))
    })

    // El cable y el inversor van en la esquina fachada-muro derecho: si ninguno de los dos mira
    // a la cámara, esa esquina queda oculta tras la casa y no se pinta.
    illo.updateGraph()
    const mira = (muro) => muro.renderNormal.z <= 0
    equipo.visible = mira(fachada) || mira(muroDerecho)
    // Los haces caen sobre el faldón del panel: si está de espaldas, quedarían atravesando la casa.
    if (!mira(faldon)) haces.forEach((h) => (h.visible = false))
    illo.renderGraph()
  }

  function bucle(ahora) {
    if (ahora - ultimo >= intervalo - 1) dibujar(ahora)
    marco = activo ? requestAnimationFrame(bucle) : 0
  }

  dibujar(performance.now())

  return {
    // El progreso del scroll (0 a 1) define en qué paso de la historia está la escena.
    progreso(valor) {
      objetivo = reducido ? 1 : limitar(valor)
    },
    reproducir(si) {
      if (reducido) return
      activo = si
      if (si && !marco) marco = requestAnimationFrame(bucle)
    },
    // Botón táctil: mientras se mantiene presionado, el desplazamiento del dedo gira la casa;
    // al soltarlo la casa deja de seguir el dedo y gira sola.
    empezarGiro() {
      giroSolo = false
      giroInicio = giroUsuario
    },
    moverGiro(dx) {
      giroUsuario = giroInicio - (dx / canvas.clientWidth) * TAU * 0.8
      if (!activo) dibujar(performance.now())
    },
    soltarGiro() {
      giroSolo = true
    },
    destruir() {
      activo = false
      cancelAnimationFrame(marco)
    },
  }
}

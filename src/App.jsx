import { useEffect, useState } from 'react'
import { obtenerTrabajos, trabajosIniciales } from './api/trabajos.js'

const WA = 'https://wa.me/573138130046'
const wa = (texto) => `${WA}?text=${encodeURIComponent(texto)}`
const MAPA =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248.93033764012515!2d-76.5238692265609!3d3.3781739830128097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a11313ec31c5%3A0x2c183a56456f74e5!2sCl.%2028%20%2386-70%2C%20Comuna%2017%2C%20Cali%2C%20Valle%20del%20Cauca!5e0!3m2!1ses-419!2sco!4v1770853641815!5m2!1ses-419!2sco'

const fotovoltaico = [
  'Ingeniería detallada para proyectos solares',
  'Trámites de conexión ante el operador de red',
  'Trámites para beneficios tributarios',
  'Estudio de conexión simplificada para sistemas solares fotovoltaicos (AGPE y GD)',
  'Mantenimiento preventivo y correctivo',
]

const termico = [
  'Climatización de piscinas con energía solar térmica',
  'Calentamiento de aguas sanitarias con sistemas solares térmicos',
  'Mantenimiento preventivo y correctivo',
]

const beneficios = [
  'Reducción significativa en costos de energía.',
  'Contribución directa al cuidado del medio ambiente.',
  'Cumplimiento total de normativas técnicas y legales.',
  'Soluciones personalizadas según cada necesidad.',
  'Mayor independencia energética y retorno de inversión.',
]

const nav = [
  ['Servicios', '#servicios'],
  ['Trabajos', '#trabajos'],
  ['Nosotros', '#nosotros'],
  ['Beneficios', '#beneficios'],
  ['Contacto', '#contacto'],
]

function IconoWhatsApp() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 20l1.2-4.1A8 8 0 1 1 8.2 19L4 20Z M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-1.9-1-.8.8c-.9-.4-1.700-1.200-2.100-2.100l.8-.8-1-1.900L9 9.500Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Flecha() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Header() {
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('sin-scroll', abierto)
    const cerrar = (e) => e.key === 'Escape' && setAbierto(false)
    window.addEventListener('keydown', cerrar)
    return () => {
      window.removeEventListener('keydown', cerrar)
      document.body.classList.remove('sin-scroll')
    }
  }, [abierto])

  return (
    <header className="cabecera">
      <div className="cabecera__barra">
        <a className="cabecera__logo" href="#inicio" aria-label="Soltherra S.A.S., ir al inicio">
          <img src="/img/logo.webp" alt="Soltherra S.A.S. Energía Sostenible" width="105" height="56" />
        </a>
        <nav className="cabecera__nav" aria-label="Principal">
          {nav.map(([t, h]) => (
            <a key={h} href={h}>
              {t}
            </a>
          ))}
        </nav>
        <a
          className="boton boton--corto"
          href={wa('Hola Soltherra, quiero cotizar un sistema solar.')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconoWhatsApp />
          <span>WhatsApp</span>
        </a>
        <button
          type="button"
          className="cabecera__menu"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          onClick={() => setAbierto((v) => !v)}
        >
          <span className="sr">{abierto ? 'Cerrar menú' : 'Abrir menú'}</span>
          <span className="cabecera__barras" aria-hidden="true" />
        </button>
      </div>
      <div className="progreso" aria-hidden="true" />
      <div id="menu-movil" className="menu-movil" data-abierto={abierto} hidden={!abierto}>
        <nav aria-label="Menú móvil">
          {nav.map(([t, h]) => (
            <a key={h} href={h} onClick={() => setAbierto(false)}>
              {t}
            </a>
          ))}
        </nav>
        <a
          className="boton boton--viva"
          href={wa('Hola Soltherra, quiero cotizar un sistema solar.')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconoWhatsApp />
          <span>Escríbenos por WhatsApp</span>
        </a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <img
        className="hero__foto"
        src="/img/hero.webp"
        alt="Paneles solares fotovoltaicos instalados en una cubierta, bajo un cielo con nubes"
        width="1800"
        height="1350"
        fetchPriority="high"
      />
      <div className="hero__velo" />
      <div className="contenedor hero__texto">
        <h1>
          <span className="linea">
            <span>Energía solar</span>
          </span>
          <span className="linea">
            <span>para tu hogar,</span>
          </span>
          <span className="linea">
            <span>tu empresa o</span>
          </span>
          <span className="linea">
            <span>tu institución.</span>
          </span>
        </h1>
        <p className="hero__sub rise">
          Diseñamos, instalamos y mantenemos sistemas solares fotovoltaicos y solares térmicos, con cumplimiento
          normativo y soluciones a la medida.
        </p>
        <div className="hero__acciones rise">
          <a
            className="boton boton--viva"
            href={wa('Hola Soltherra, quiero cotizar un sistema solar.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconoWhatsApp />
            <span>Habla con un experto</span>
          </a>
          <a className="enlace enlace--claro" href="#servicios">
            Ver servicios <Flecha />
          </a>
        </div>
      </div>
    </section>
  )
}

function Nosotros() {
  return (
    <section className="seccion nosotros" id="nosotros">
      <div className="contenedor nosotros__rejilla">
        <div className="nosotros__texto">
          <h2 className="sr">Quiénes somos</h2>
          <p className="destacado">
            Somos una empresa especializada en el diseño, instalación y mantenimiento de sistemas solares
            fotovoltaicos y sistemas solares térmicos.
          </p>
          <p>
            Ofrecemos soluciones energéticas sostenibles, eficientes y personalizadas para hogares, empresas e
            instituciones. Soltherra acompaña a sus clientes desde la ingeniería hasta la puesta en marcha,
            garantizando cumplimiento normativo, ahorro económico y reducción del impacto ambiental.
          </p>
        </div>
        <figure className="foto foto--vertical nosotros__foto">
          <img
            src="/img/cableado.webp"
            alt="Técnico ajustando las conexiones de un inversor solar"
            width="900"
            height="1200"
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  )
}

function Lista({ items }) {
  return (
    <ul className="filas">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
}

function Servicios() {
  return (
    <>
      <section className="seccion servicio servicio--fv" id="servicios">
        <div className="contenedor servicio__rejilla">
          <div className="servicio__fotos">
            <figure className="foto foto--ancha">
              <img
                src="/img/instalacion.webp"
                alt="Dos técnicos instalando módulos fotovoltaicos sobre una cubierta"
                width="1200"
                height="667"
                loading="lazy"
              />
            </figure>
            <figure className="foto foto--cuadrada servicio__inserto">
              <img
                src="/img/inversor.webp"
                alt="Inversor solar instalado en pared con canalización eléctrica"
                width="1000"
                height="1333"
                loading="lazy"
              />
            </figure>
          </div>
          <div className="servicio__texto">
            <h2>Diseño e instalación de sistemas solares fotovoltaicos</h2>
            <p>
              Soluciones integrales en energía solar, desde el diseño hasta la puesta en marcha de sistemas
              fotovoltaicos adaptados a hogares, empresas e instituciones, garantizando eficiencia, seguridad y
              cumplimiento normativo.
            </p>
            <Lista items={fotovoltaico} />
            <p className="servicio__cierre">Reduce costos energéticos y dependencia de la red eléctrica.</p>
            <a
              className="boton boton--viva"
              href={wa('Hola Soltherra, quiero información sobre sistemas solares fotovoltaicos.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconoWhatsApp />
              <span>Hablar con un experto</span>
            </a>
          </div>
        </div>
      </section>

      <section className="seccion servicio servicio--termico">
        <div className="contenedor servicio__rejilla servicio__rejilla--inversa">
          <div className="servicio__texto">
            <h2>Diseño e instalación de sistemas solares térmicos</h2>
            <p>
              Diseñamos e instalamos sistemas solares térmicos para el aprovechamiento eficiente de la radiación
              solar, ofreciendo soluciones sostenibles para climatización y calentamiento de agua en hogares,
              empresas e instituciones.
            </p>
            <Lista items={termico} />
            <p className="servicio__cierre">Ahorro energético sostenible con confort térmico continuo.</p>
            <a
              className="boton"
              href={wa('Hola Soltherra, quiero información sobre sistemas solares térmicos.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconoWhatsApp />
              <span>Hablar con un experto</span>
            </a>
          </div>
          <div className="servicio__fotos">
            <figure className="foto foto--ancha">
              <img
                src="/img/colectores.webp"
                alt="Colectores solares térmicos de tubos al vacío instalados junto a una casa"
                width="1600"
                height="1200"
                loading="lazy"
              />
            </figure>
            <figure className="foto foto--cuadrada servicio__inserto">
              <img
                src="/img/tanque.webp"
                alt="Calentador solar de agua con tanque sobre una terraza"
                width="900"
                height="1200"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      <figure className="franja foto" data-revelar>
        <img
          src="/img/piscina.webp"
          alt="Piscina en una finca con una estructura de colectores solares térmicos sobre la terraza"
          width="1600"
          height="640"
          decoding="async"
        />
      </figure>
    </>
  )
}

function Trabajos() {
  const [trabajos, setTrabajos] = useState(trabajosIniciales)

  useEffect(() => {
    let activo = true
    obtenerTrabajos().then((d) => activo && setTrabajos(d))
    return () => {
      activo = false
    }
  }, [])

  useEffect(() => {
    // Obras que llegan después de la carga inicial (API real) no pasan por el observador: se muestran ya visibles.
    if (trabajos === trabajosIniciales) return
    document.querySelectorAll('.trabajos [data-sube]').forEach((el) => el.classList.add('visto'))
  }, [trabajos])

  return (
    <section className="seccion trabajos" id="trabajos">
      <div className="contenedor">
        <div className="trabajos__encabezado" data-sube>
          <h2>Nuestros trabajos</h2>
          <p>Instalaciones de sistemas solares fotovoltaicos y térmicos realizadas por Soltherra.</p>
        </div>
        <div className="trabajos__rejilla">
          {trabajos.map((t, i) => (
            <figure key={t.id} className={`trabajo trabajo--${t.posicion}`} data-sube style={{ '--i': i % 3 }}>
              <div className="trabajo__foto foto">
                <img src={t.foto} alt={t.alt} width={t.ancho} height={t.alto} loading="lazy" />
              </div>
              <figcaption>
                {t.cliente && <strong>{t.cliente}</strong>}
                {t.titulo}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function MisionVision() {
  return (
    <section className="seccion mision" aria-label="Misión y visión">
      <div className="contenedor mision__rejilla">
        <div className="mision__bloque mision__bloque--ancho">
          <h2>Misión</h2>
          <p>
            Brindar soluciones energéticas sostenibles a través de sistemas solares fotovoltaicos y solares
            térmicos, contribuyendo al ahorro económico, al cuidado del medio ambiente y al bienestar de las
            comunidades, con un servicio confiable, innovador y de alta calidad.
          </p>
        </div>
        <div className="mision__bloque">
          <h2>Visión</h2>
          <p>
            Ser una empresa líder en energías limpias en Colombia, reconocida por su compromiso con la
            sostenibilidad, la innovación tecnológica y la transformación positiva de los hogares, empresas y
            comunidades hacia un futuro energético responsable.
          </p>
        </div>
      </div>
    </section>
  )
}

function Beneficios() {
  return (
    <section className="seccion beneficios" id="beneficios">
      <div className="contenedor beneficios__rejilla">
        <h2>Beneficios</h2>
        <ul className="beneficios__lista">
          {beneficios.map((b) => (
            <li key={b}>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Contacto() {
  return (
    <footer className="seccion contacto" id="contacto">
      <div className="contenedor">
        <p className="contacto__lema">Energía limpia que transforma tu futuro.</p>
        <div className="contacto__rejilla">
          <div className="contacto__datos">
            <h2 className="sr">Contáctanos</h2>
            <dl>
              <div>
                <dt>Celular</dt>
                <dd>
                  <a href="tel:+573138130046">+57 313 813 0046</a>
                </dd>
              </div>
              <div>
                <dt>Correo</dt>
                <dd>
                  <a href="mailto:soltherra23@gmail.com">soltherra23@gmail.com</a>
                </dd>
              </div>
              <div>
                <dt>Dirección</dt>
                <dd>Calle 28 N° 86 - 70, Cali</dd>
              </div>
            </dl>
            <a
              className="boton boton--viva"
              href={wa('Hola Soltherra, quiero cotizar un sistema solar.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconoWhatsApp />
              <span>Escribir por WhatsApp</span>
            </a>
          </div>
          <div className="contacto__mapa">
            <iframe
              title="Ubicación de Soltherra, Calle 28 N° 86-70, Cali"
              src={MAPA}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <p className="contacto__mapa-enlace">
              <a
                className="enlace"
                href="https://www.google.com/maps/search/?api=1&query=Calle+28+%2386-70+Cali+Valle+del+Cauca"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir en Google Maps <Flecha />
              </a>
            </p>
          </div>
        </div>
        <div className="pie">
          <p>© 2026 Soltherra S.A.S.</p>
          <p className="pie__redes">
            <a href="https://www.instagram.com/soltherra_energiasostenible/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://web.facebook.com/profile.php?id=61587216064854" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href={WA} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  useEffect(() => {
    let marco = 0
    const medir = () => {
      marco = 0
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      const root = document.documentElement.style
      root.setProperty('--progreso', max > 0 ? (y / max).toFixed(4) : '0')
    }
    const alScroll = () => {
      if (!marco) marco = requestAnimationFrame(medir)
    }
    medir()
    window.addEventListener('scroll', alScroll, { passive: true })
    window.addEventListener('resize', alScroll)
    return () => {
      cancelAnimationFrame(marco)
      window.removeEventListener('scroll', alScroll)
      window.removeEventListener('resize', alScroll)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.add('js')
    const items = document.querySelectorAll('[data-revelar], [data-sube]')
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('visto'))
      return
    }
    const io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visto')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <a className="salto" href="#nosotros">
        Saltar al contenido
      </a>
      <Header />
      <main>
        <Hero />
        <Nosotros />
        <Servicios />
        <Trabajos />
        <MisionVision />
        <Beneficios />
      </main>
      <Contacto />
    </>
  )
}

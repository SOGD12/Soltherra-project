import { useState } from 'react'
import { Icono, IconoWhatsApp } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import { TEL, TEL2, CORREO, DIRECCION, SERVICIOS_FORMULARIO, mensajeContacto, wa, MAPA } from '../data/contenido.js'

function Formulario() {
  const [nombre, setNombre] = useState('')
  const [servicio, setServicio] = useState(SERVICIOS_FORMULARIO[0])
  const [mensaje, setMensaje] = useState('')
  const [acepta, setAcepta] = useState(false)

  const enviar = (e) => {
    e.preventDefault()
    // Consentimiento explícito (ISO/IEC 27701): sin la casilla marcada no se arma ningún mensaje.
    if (!acepta) return
    window.open(wa(mensajeContacto({ nombre, servicio, mensaje })), '_blank', 'noopener,noreferrer')
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h3>Cuéntanos qué necesitas</h3>
      <label>
        <span>Tu nombre</span>
        <input
          type="text"
          name="nombre"
          required
          maxLength={80}
          autoComplete="name"
          placeholder="Nombre y apellido"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </label>
      <label>
        <span>Servicio de interés</span>
        <select name="servicio" value={servicio} onChange={(e) => setServicio(e.target.value)}>
          {SERVICIOS_FORMULARIO.map((opcion) => (
            <option key={opcion}>{opcion}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Mensaje (opcional)</span>
        <textarea name="mensaje" rows="3" placeholder="Ej. casa de 4 personas en Cali, factura de $400.000" maxLength={500} value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
      </label>
      <label className="formulario__acepto">
        <input type="checkbox" name="acepto" required checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
        <span>
          Autorizo el tratamiento de mis datos para recibir una cotización, según la{' '}
          <a href="/privacidad" target="_blank" rel="noopener noreferrer">
            política de privacidad
          </a>
          .
        </span>
      </label>
      <button type="submit" className="boton">
        <IconoWhatsApp />
        <span>Enviar por WhatsApp</span>
      </button>
      <p className="formulario__nota">Esta página no guarda tus datos: se abrirá WhatsApp con tu mensaje listo para enviar.</p>
    </form>
  )
}

export default function Contacto() {
  return (
    <section className="seccion-isla" id="contacto">
      <div className="isla contacto" data-isla>
        <span className="isla__brillo" aria-hidden="true" />
        <div className="contenedor">
          <Chip claro>Contacto</Chip>
          <h1 className="contacto__lema" data-titulo>
            Energía sostenible que <em className="acento">transforma</em> tu futuro.
          </h1>
          <div className="contacto__rejilla">
            <div className="contacto__datos">
              <dl>
                <div>
                  <dt>
                    <Icono nombre="call" /> Celular
                  </dt>
                  <dd>
                    <a href="tel:+573138130046">{TEL}</a>
                    <br />
                    <a href="tel:+573128787181">{TEL2}</a>
                  </dd>
                </div>
                <div>
                  <dt>
                    <Icono nombre="mail" /> Correo
                  </dt>
                  <dd>
                    <a href={`mailto:${CORREO}`}>{CORREO}</a>
                  </dd>
                </div>
                <div>
                  <dt>
                    <Icono nombre="location_on" /> Dirección
                  </dt>
                  <dd>{DIRECCION}</dd>
                </div>
              </dl>
              <div className="contacto__mapa">
                <iframe
                  title="Ubicación de Soltherra, Calle 28 N° 86-70, Cali"
                  src={MAPA}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <a
                  className="enlace"
                  href="https://www.google.com/maps/search/?api=1&query=Calle+28+%2386-70+Cali+Valle+del+Cauca"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir en Google Maps <Icono nombre="open_in_new" />
                </a>
              </div>
            </div>
            <Formulario />
          </div>
        </div>
      </div>
    </section>
  )
}

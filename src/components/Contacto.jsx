import { useState } from 'react'
import { Icono, IconoWhatsApp } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import { TEL, CORREO, DIRECCION, wa, MAPA } from '../data/contenido.js'

function Formulario() {
  const [nombre, setNombre] = useState('')
  const [servicio, setServicio] = useState('Sistema fotovoltaico')
  const [mensaje, setMensaje] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    const texto =
      `Hola Soltherra, soy ${nombre.trim()}. Me interesa: ${servicio}.` + (mensaje.trim() ? ` ${mensaje.trim()}` : '')
    window.open(wa(texto), '_blank', 'noopener,noreferrer')
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
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </label>
      <label>
        <span>Servicio de interés</span>
        <select name="servicio" value={servicio} onChange={(e) => setServicio(e.target.value)}>
          <option>Sistema fotovoltaico</option>
          <option>Sistema solar térmico</option>
          <option>Climatización de piscina</option>
          <option>Mantenimiento</option>
          <option>Trámites y beneficios tributarios</option>
        </select>
      </label>
      <label>
        <span>Mensaje (opcional)</span>
        <textarea name="mensaje" rows="3" maxLength={500} value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
      </label>
      <button type="submit" className="boton">
        <IconoWhatsApp />
        <span>Enviar por WhatsApp</span>
      </button>
      <p className="formulario__nota">Se abrirá WhatsApp con tu mensaje listo para enviar.</p>
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
          <h2 className="contacto__lema" data-titulo>
            Energía limpia que <em className="acento">transforma</em> tu futuro.
          </h2>
          <div className="contacto__rejilla">
            <div className="contacto__datos">
              <dl>
                <div>
                  <dt>
                    <Icono nombre="call" /> Celular
                  </dt>
                  <dd>
                    <a href="tel:+573138130046">{TEL}</a>
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
                  referrerPolicy="no-referrer-when-downgrade"
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

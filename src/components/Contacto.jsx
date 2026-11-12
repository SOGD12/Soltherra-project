import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icono, IconoWhatsApp } from './Iconos.jsx'
import { Chip } from './Comunes.jsx'
import { TEL, TEL2, CORREO, DIRECCION, mensajeContacto, wa, mapa } from '../data/contenido.js'

function Formulario() {
  const { t } = useTranslation('global')
  const servicios = t('contact.form.services', { returnObjects: true })
  const [nombre, setNombre] = useState('')
  // Se guarda la posición del servicio (no el texto) para que siga elegido al cambiar de idioma.
  const [servicio, setServicio] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [acepta, setAcepta] = useState(false)

  const enviar = (e) => {
    e.preventDefault()
    // Consentimiento explícito (ISO/IEC 27701): sin la casilla marcada no se arma ningún mensaje.
    if (!acepta) return
    window.open(wa(mensajeContacto({ base: t('contact.whatsapp'), nombre, servicio: servicios[servicio], mensaje })), '_blank', 'noopener,noreferrer')
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h2>{t('contact.form.title')}</h2>
      <label>
        <span>{t('contact.form.name')}</span>
        <input
          type="text"
          name="nombre"
          required
          maxLength={80}
          autoComplete="name"
          placeholder={t('contact.form.name-placeholder')}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </label>
      <label>
        <span>{t('contact.form.service')}</span>
        <select name="servicio" value={servicio} onChange={(e) => setServicio(Number(e.target.value))}>
          {servicios.map((opcion, i) => (
            <option key={opcion} value={i}>
              {opcion}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>{t('contact.form.message')}</span>
        <textarea name="mensaje" rows="3" placeholder={t('contact.form.message-placeholder')} maxLength={500} value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
      </label>
      <label className="formulario__acepto">
        <input type="checkbox" name="acepto" required checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
        <span>
          {t('contact.form.consent-before')}{' '}
          <a href="/privacidad" target="_blank" rel="noopener noreferrer">
            {t('contact.form.consent-link')}
          </a>
          {t('contact.form.consent-after')}
        </span>
      </label>
      <button type="submit" className="boton">
        <IconoWhatsApp />
        <span>{t('contact.form.submit')}</span>
      </button>
      <p className="formulario__nota">{t('contact.form.note')}</p>
    </form>
  )
}

export default function Contacto() {
  const { t, i18n } = useTranslation('global')
  return (
    <section className="seccion-isla" id="contacto">
      <div className="isla contacto" data-isla>
        <span className="isla__brillo" aria-hidden="true" />
        <div className="contenedor">
          <Chip claro>{t('contact.chip')}</Chip>
          <h1 className="contacto__lema" data-titulo>
            {t('contact.slogan-before')}<em className="acento">{t('contact.slogan-accent')}</em>{t('contact.slogan-after')}
          </h1>
          <div className="contacto__rejilla">
            <div className="contacto__datos">
              <dl>
                <div>
                  <dt>
                    <Icono nombre="call" /> {t('contact.phone')}
                  </dt>
                  <dd>
                    <a href="tel:+573138130046">{TEL}</a>
                    <br />
                    <a href="tel:+573128787181">{TEL2}</a>
                  </dd>
                </div>
                <div>
                  <dt>
                    <Icono nombre="mail" /> {t('contact.email')}
                  </dt>
                  <dd>
                    <a href={`mailto:${CORREO}`}>{CORREO}</a>
                  </dd>
                </div>
                <div>
                  <dt>
                    <Icono nombre="location_on" /> {t('contact.address')}
                  </dt>
                  <dd>{DIRECCION}</dd>
                </div>
              </dl>
              <div className="contacto__mapa">
                <iframe
                  title={t('contact.map-title')}
                  src={mapa(i18n.language)}
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
                  {t('contact.map-link')} <Icono nombre="open_in_new" />
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

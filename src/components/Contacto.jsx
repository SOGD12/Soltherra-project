import { MAPA, WA, wa } from '../data/contenido.js'
import { Flecha, IconoWhatsApp } from './Iconos.jsx'

export default function Contacto() {
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

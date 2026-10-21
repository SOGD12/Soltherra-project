import { WA, INSTAGRAM, FACEBOOK, nav } from '../data/contenido.js'

export default function Pie() {
  return (
    <footer className="pie">
      <div className="contenedor pie__rejilla">
        <div className="pie__marca">
          <p className="pie__nombre">Soltherra S.A.S.</p>
          <p>Energía Sostenible. Sistemas solares fotovoltaicos y solares térmicos.</p>
        </div>
        <div className="pie__cols">
          <nav aria-label="Pie de página">
            <p className="pie__titulo">Secciones</p>
            <ul>
              {nav.map(([t, h]) => (
                <li key={h}>
                  <a href={h}>{t}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="pie__titulo">Síguenos</p>
            <ul>
              <li>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={FACEBOOK} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href={WA} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="pie__gigante" aria-hidden="true">
        Soltherra
      </p>
      <div className="contenedor">
        <p className="pie__legal">© 2026 Soltherra S.A.S.</p>
      </div>
    </footer>
  )
}

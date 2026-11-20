import { useTranslation } from 'react-i18next'
import { WA, INSTAGRAM, FACEBOOK, TEL, TEL2, CORREO, DIRECCION, nav } from '../data/contenido.js'
import { EVENTO_ABRIR } from '../analitica.js'
import useEnlace from '../hooks/useEnlace.js'

// Número para el enlace tel: (solo dígitos y el +).
const tel = (numero) => `tel:${numero.replace(/[^\d+]/g, '')}`

export default function Pie() {
  const { t } = useTranslation('global')
  const enlace = useEnlace()
  return (
    <footer className="pie">
      <div className="contenedor pie__rejilla">
        <div className="pie__marca">
          <p className="pie__nombre">Soltherra S.A.S.</p>
          <p>{t('footer.tagline')}</p>
        </div>
        <div className="pie__cols">
          <nav aria-label={t('footer.nav-label')}>
            <p className="pie__titulo">{t('footer.sections')}</p>
            <ul>
              {nav.map(([clave, h]) => (
                <li key={h}>
                  <a href={enlace(h)}>{t(`menu.${clave}`)}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="pie__titulo">{t('footer.follow')}</p>
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
          {/* Nombre, dirección y teléfono visibles en todas las páginas: coinciden con los del JSON-LD (seo.js) y con /contacto. */}
          <address className="pie__contacto">
            <p className="pie__titulo">{t('footer.contact')}</p>
            <ul>
              <li>
                <a href={tel(TEL)}>{TEL}</a>
              </li>
              <li>
                <a href={tel(TEL2)}>{TEL2}</a>
              </li>
              <li>
                <a href={`mailto:${CORREO}`}>{CORREO}</a>
              </li>
              <li className="pie__direccion">{DIRECCION}</li>
            </ul>
          </address>
        </div>
      </div>
      <p className="pie__gigante" aria-hidden="true">
        Soltherra
      </p>
      <div className="contenedor">
        <p className="pie__legal">
          {t('footer.legal')} <a href={enlace('/#nosotros')}>{t('footer.about')}</a> ·{' '}
          <a href={enlace('/privacidad')}>{t('footer.privacy')}</a> ·{' '}
          <a href={enlace('/terminos')}>{t('footer.terms')}</a> ·{' '}
          <button type="button" className="pie__cookies" onClick={() => window.dispatchEvent(new Event(EVENTO_ABRIR))}>
            {t('footer.cookies')}
          </button>
        </p>
      </div>
    </footer>
  )
}

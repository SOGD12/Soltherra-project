import { useTranslation } from 'react-i18next'
import { WA, INSTAGRAM, FACEBOOK, nav } from '../data/contenido.js'
import { EVENTO_ABRIR } from '../analitica.js'

export default function Pie() {
  const { t } = useTranslation('global')
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
                  <a href={h}>{t(`menu.${clave}`)}</a>
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
        </div>
      </div>
      <p className="pie__gigante" aria-hidden="true">
        Soltherra
      </p>
      <div className="contenedor">
        <p className="pie__legal">
          {t('footer.legal')} <a href="/privacidad">{t('footer.privacy')}</a> ·{' '}
          <button type="button" className="pie__cookies" onClick={() => window.dispatchEvent(new Event(EVENTO_ABRIR))}>
            {t('footer.cookies')}
          </button>
        </p>
      </div>
    </footer>
  )
}

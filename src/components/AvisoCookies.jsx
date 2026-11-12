import { useEffect, useState, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { EVENTO_ABRIR, cargarGTM, guardarConsentimiento, leerConsentimiento, suscribirConsentimiento } from '../analitica.js'

// En el pre-renderizado no hay respuesta que leer: el aviso no va en el HTML y aparece al hidratar si hace falta.
const enServidor = () => 'servidor'

/** Aviso de cookies de medición. Aparece hasta que la persona responde; desde el pie se puede volver a abrir. */
export default function AvisoCookies() {
  const { t } = useTranslation('global')
  const respuesta = useSyncExternalStore(suscribirConsentimiento, leerConsentimiento, enServidor)
  const [abierto, setAbierto] = useState(false)

  // Quien ya aceptó en una visita anterior: se carga GTM sin volver a preguntar.
  useEffect(() => {
    if (respuesta === 'si') cargarGTM()
  }, [respuesta])

  useEffect(() => {
    const abrir = () => setAbierto(true)
    window.addEventListener(EVENTO_ABRIR, abrir)
    return () => window.removeEventListener(EVENTO_ABRIR, abrir)
  }, [])

  if (!abierto && respuesta !== null) return null

  const responder = (valor) => {
    setAbierto(false)
    guardarConsentimiento(valor)
  }

  return (
    <section className="aviso-cookies" role="region" aria-labelledby="t-cookies">
      <p id="t-cookies" className="aviso-cookies__titulo">
        {t('cookies.title')}
      </p>
      <p className="aviso-cookies__texto">
        {t('cookies.text')} <a href="/privacidad">{t('cookies.link')}</a>.
      </p>
      <div className="aviso-cookies__acciones">
        <button type="button" className="boton boton--viva" onClick={() => responder('si')}>
          {t('cookies.accept')}
        </button>
        <button type="button" className="boton aviso-cookies__rechazar" onClick={() => responder('no')}>
          {t('cookies.reject')}
        </button>
      </div>
    </section>
  )
}

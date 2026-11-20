import i18next from 'i18next'

import global_es from './languages/es/global.json'
import global_en from './languages/en/global.json'
import { IDIOMAS, idiomaDeRuta } from './rutas.js'

export { IDIOMAS }
const HTML_LANG = { es: 'es-CO', en: 'en' }

// El idioma lo decide la dirección: /en/... en inglés, todo lo demás en español (ver rutas.js). Así cada idioma
// tiene su propia URL, que los buscadores pueden indexar. En el servidor se fija al pre-renderizar (entry-server.jsx).
const idiomaInicial = () => (typeof window === 'undefined' ? 'es' : idiomaDeRuta(window.location.pathname))

i18next.init({
  interpolation: { escapeValue: false },
  lng: idiomaInicial(),
  fallbackLng: 'es',
  initAsync: false,
  react: { useSuspense: false },
  resources: {
    es: { global: global_es },
    en: { global: global_en },
  },
})

i18next.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') document.documentElement.lang = HTML_LANG[lng] ?? lng
})

/** Pone el idioma que corresponde a la dirección actual (al navegar entre /servicios y /en/services, o con el botón atrás). */
export const sincronizarIdioma = (pathname) => {
  const idioma = idiomaDeRuta(pathname)
  if (idioma !== i18next.language) i18next.changeLanguage(idioma)
}

export default i18next

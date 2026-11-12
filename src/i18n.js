import i18next from 'i18next'

import global_es from './languages/es/global.json'
import global_en from './languages/en/global.json'


export const IDIOMAS = ['es', 'en']
const HTML_LANG = { es: 'es-CO', en: 'en' }

// Cookie "language" con el idioma elegido. Solo se aceptan los valores de IDIOMAS, al leer y al guardar.
const leerCookie = () => document.cookie.match(/(?:^|;\s*)language=([^;]*)/)?.[1]

const guardarCookie = (idioma) => {
  const segura = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `language=${idioma}; Max-Age=31536000; Path=/; SameSite=Lax${segura}`
}

const idiomaGuardado = () => {
  const guardado = typeof document === 'undefined' ? undefined : leerCookie()
  return IDIOMAS.includes(guardado) ? guardado : 'es'
}

i18next.init({
  interpolation: { escapeValue: false },
  lng: 'es',
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

export const aplicarIdiomaGuardado = () => {
  const idioma = idiomaGuardado()
  if (idioma !== i18next.language) i18next.changeLanguage(idioma)
}

export const cambiarIdioma = (idioma) => {
  if (!IDIOMAS.includes(idioma)) return Promise.resolve()
  guardarCookie(idioma)
  return i18next.changeLanguage(idioma)
}

export default i18next

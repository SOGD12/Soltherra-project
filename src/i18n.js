import i18next from 'i18next'
import Cookies from 'js-cookie'

import global_es from './languages/es/global.json'
import global_en from './languages/en/global.json'


export const IDIOMAS = ['es', 'en']
const HTML_LANG = { es: 'es-CO', en: 'en' }

const idiomaGuardado = () => {
  const guardado = typeof document === 'undefined' ? undefined : Cookies.get('language')
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
  Cookies.set('language', idioma, { expires: 365, sameSite: 'lax' })
  return i18next.changeLanguage(idioma)
}

export default i18next

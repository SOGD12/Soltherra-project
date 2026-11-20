import { useTranslation } from 'react-i18next'
import { localizar } from '../rutas.js'

/** Devuelve una función que pasa un enlace interno (escrito en español, ej. '/servicios#termico') al idioma que se está viendo,
 *  para que en inglés los enlaces vayan a /en/services y no a la página en español. */
export default function useEnlace() {
  const { i18n } = useTranslation('global')
  return (href) => localizar(href, i18n.language)
}

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { aplicarIdiomaGuardado } from './i18n.js'
import Header from './components/Header.jsx'
import Pie from './components/Pie.jsx'
import useProgresoScroll from './hooks/useProgresoScroll.js'
import useAnimaciones from './hooks/useAnimaciones.js'
import useScrollPagina from './hooks/useScrollPagina.js'
import useRuta from './ruta.js'
import { CONTENIDO_DE_PAGINA } from './paginas.jsx'

export default function App() {
  const { pagina, ancla } = useRuta()
  const { i18n } = useTranslation('global')
  const idioma = i18n.language
  const Pagina = CONTENIDO_DE_PAGINA[pagina]

  // Idioma elegido antes (cookie): se cambia después de hidratar, para que el HTML en español coincida al hidratar.
  useEffect(aplicarIdiomaGuardado, [])

  useProgresoScroll()
  useAnimaciones(pagina, idioma)
  useScrollPagina(pagina, ancla)

  return (
    <>
      <Header pagina={pagina} />
      {/* Al cambiar de idioma el contenido se vuelve a montar: las animaciones de texto parten las palabras en el DOM. */}
      <main id="contenido" tabIndex={-1} key={`${pagina}-${idioma}`}>
        <Pagina />
      </main>
      <Pie />
    </>
  )
}

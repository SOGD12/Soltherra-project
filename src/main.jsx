import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/hanken-grotesk'
import './styles/base.css'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n.js'
import App from './App.jsx'

const raiz = document.getElementById('root')
const app = (
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>
)

// En producción el HTML ya viene pre-renderizado: se hidrata. En desarrollo la raíz está vacía.
if (raiz.hasChildNodes()) hydrateRoot(raiz, app)
else createRoot(raiz).render(app)
// El idioma guardado (cookie) se aplica en App.jsx al terminar de hidratar: el HTML pre-renderizado viene en español.


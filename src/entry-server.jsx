import { renderToString } from 'react-dom/server'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n.js'
import App from './App.jsx'
import { fijarPaginaServidor } from './ruta.js'

// Lo usa el plugin de pre-renderizado de vite.config.js para escribir el HTML de cada página al compilar.
export const render = (pagina) => {
  fijarPaginaServidor(pagina)
  return renderToString(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>,
  )
}

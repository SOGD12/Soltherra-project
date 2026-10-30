import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { fijarPaginaServidor } from './ruta.js'

// Lo usa el plugin de pre-renderizado de vite.config.js para escribir el HTML de cada página al compilar.
export const render = (pagina) => {
  fijarPaginaServidor(pagina)
  return renderToString(<App />)
}

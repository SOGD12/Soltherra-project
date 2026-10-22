import { renderToString } from 'react-dom/server'
import App from './App.jsx'

// Lo usa el plugin de pre-renderizado de vite.config.js para escribir el HTML de la página al compilar.
export const render = () => renderToString(<App />)

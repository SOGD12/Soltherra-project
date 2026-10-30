import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/hanken-grotesk'
import './index.css'
import App from './App.jsx'

const raiz = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// En producción el HTML ya viene pre-renderizado: se hidrata. En desarrollo la raíz está vacía.
if (raiz.hasChildNodes()) hydrateRoot(raiz, app)
else createRoot(raiz).render(app)

// Analítica de Vercel: se carga cuando la página ya terminó, para no competir con la carga inicial.
if (import.meta.env.PROD) {
  addEventListener('load', () => import('@vercel/analytics').then(({ inject }) => inject()), { once: true })
}

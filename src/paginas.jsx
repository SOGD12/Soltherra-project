import Hero from './components/Hero.jsx'
import Cinta from './components/Cinta.jsx'
import Nosotros from './components/Nosotros.jsx'
import MisionVision from './components/MisionVision.jsx'
import Soluciones from './components/Soluciones.jsx'
import Cierre from './components/Cierre.jsx'
import Gestiones from './components/Gestiones.jsx'
import Servicios from './components/Servicios.jsx'
import Recorrido from './components/Recorrido.jsx'
import Proceso from './components/Proceso.jsx'
import Infografias from './components/Infografias.jsx'
import Monitoreo from './components/Monitoreo.jsx'
import Trabajos from './components/Trabajos.jsx'
import Beneficios from './components/Beneficios.jsx'
import Contacto from './components/Contacto.jsx'
import Privacidad from './components/Privacidad.jsx'
import { LlamadaExperto } from './components/Comunes.jsx'
import Guia from './components/Guia.jsx'

// Cada página trae sus estilos desde src/styles/<página>.css; lo que se comparte está en src/styles/base.css (ver main.jsx).
import './styles/inicio.css'
import './styles/servicios.css'
import './styles/como-funciona.css'
import './styles/trabajos.css'
import './styles/contacto.css'
import './styles/privacidad.css'
import './styles/plegables.css' // al final: ajustes para plegables y doble pantalla

// Qué secciones forman cada página. Para añadir una página: una entrada aquí, otra en seo.js y su nombre en ruta.js.
// Cada pestaña del menú es una página: solo se monta lo suyo, así no carga todo en un mismo lugar.
export const CONTENIDO_DE_PAGINA = {
  inicio: () => (
    <>
      <Hero />
      <Cinta />
      <Nosotros />
      <MisionVision />
      <Soluciones />
      <Guia pagina="inicio" />
      <Cierre />
    </>
  ),
  servicios: () => (
    <>
      <Gestiones />
      <Servicios />
      <Guia pagina="servicios" />
    </>
  ),
  'como-funciona': () => (
    <>
      <Recorrido />
      <Proceso />
      <Infografias />
      <Monitoreo />
      <Guia pagina="como-funciona" />
      <LlamadaExperto clave="how-it-works.expert" />
    </>
  ),
  trabajos: () => (
    <>
      <Trabajos />
      <Beneficios />
      <Guia pagina="trabajos" />
      <LlamadaExperto clave="works.expert" />
    </>
  ),
  contacto: () => (
    <>
      <Contacto />
      <Guia pagina="contacto" />
    </>
  ),
  privacidad: () => <Privacidad />,
}

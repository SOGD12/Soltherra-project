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
import Trabajos from './components/Trabajos.jsx'
import Beneficios from './components/Beneficios.jsx'
import Contacto from './components/Contacto.jsx'
import Privacidad from './components/Privacidad.jsx'
import { LlamadaExperto } from './components/Comunes.jsx'
// Cada página trae sus estilos desde src/styles/<página>.css; lo que se comparte está en src/styles/base.css (ver main.jsx).
import './styles/inicio.css'
import './styles/servicios.css'
import './styles/como-funciona.css'
import './styles/trabajos.css'
import './styles/contacto.css'
import './styles/privacidad.css'

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
      <Cierre />
    </>
  ),
  servicios: () => (
    <>
      <Gestiones />
      <Servicios />
    </>
  ),
  'como-funciona': () => (
    <>
      <Recorrido />
      <Proceso />
      <Infografias />
      <LlamadaExperto
        titulo="¿Quieres ver cómo quedaría en tu casa o empresa?"
        texto="Un experto de Soltherra te explica el proceso paso a paso y resuelve tus dudas."
        boton="Hablar con un experto"
        mensaje="Hola Soltherra, vi la sección «Cómo funciona» de su página y quiero hablar con un experto para que me expliquen cómo sería el proceso en mi caso."
      />
    </>
  ),
  trabajos: () => (
    <>
      <Trabajos />
      <Beneficios />
      <LlamadaExperto
        titulo="¿Te gustó alguno de estos trabajos?"
        texto="Cuéntanos qué tienes en mente y un experto te da más información y una cotización."
        boton="Pedir información"
        mensaje="Hola Soltherra, vi sus trabajos en la página y quiero más información sobre el servicio. ¿Me puede asesorar un experto?"
      />
    </>
  ),
  contacto: () => <Contacto />,
  privacidad: () => <Privacidad />,
}

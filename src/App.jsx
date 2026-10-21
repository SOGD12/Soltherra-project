import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Cinta from './components/Cinta.jsx'
import Nosotros from './components/Nosotros.jsx'
import MisionVision from './components/MisionVision.jsx'
import Soluciones from './components/Soluciones.jsx'
import Gestiones from './components/Gestiones.jsx'
import Servicios from './components/Servicios.jsx'
import Recorrido from './components/Recorrido.jsx'
import Proceso from './components/Proceso.jsx'
import Franja from './components/Franja.jsx'
import Trabajos from './components/Trabajos.jsx'
import Beneficios from './components/Beneficios.jsx'
import Contacto from './components/Contacto.jsx'
import Pie from './components/Pie.jsx'
import useProgresoScroll from './hooks/useProgresoScroll.js'
import useAnimaciones from './hooks/useAnimaciones.js'

export default function App() {
  useProgresoScroll()
  useAnimaciones()

  return (
    <>
      <a className="salto" href="#nosotros">
        Saltar al contenido
      </a>
      <Header />
      <main>
        <Hero />
        <Cinta />
        <Nosotros />
        <MisionVision />
        <Soluciones />
        <Gestiones />
        <Servicios />
        <Recorrido />
        <Proceso />
        <Franja />
        <Trabajos />
        <Beneficios />
        <Contacto />
      </main>
      <Pie />
    </>
  )
}

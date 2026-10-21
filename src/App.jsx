import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Nosotros from './components/Nosotros.jsx'
import Servicios from './components/Servicios.jsx'
import Trabajos from './components/Trabajos.jsx'
import MisionVision from './components/MisionVision.jsx'
import Beneficios from './components/Beneficios.jsx'
import Contacto from './components/Contacto.jsx'
import useProgresoScroll from './hooks/useProgresoScroll.js'
import useRevelar from './hooks/useRevelar.js'

export default function App() {
  useProgresoScroll()
  useRevelar()

  return (
    <>
      <a className="salto" href="#nosotros">
        Saltar al contenido
      </a>
      <Header />
      <main>
        <Hero />
        <Nosotros />
        <Servicios />
        <Trabajos />
        <MisionVision />
        <Beneficios />
      </main>
      <Contacto />
    </>
  )
}

import Header from './components/Header.jsx'
import Pie from './components/Pie.jsx'
import useProgresoScroll from './hooks/useProgresoScroll.js'
import useAnimaciones from './hooks/useAnimaciones.js'
import useScrollPagina from './hooks/useScrollPagina.js'
import useRuta from './ruta.js'
import { CONTENIDO_DE_PAGINA } from './paginas.jsx'

export default function App() {
  const { pagina, ancla } = useRuta()
  const Pagina = CONTENIDO_DE_PAGINA[pagina]

  useProgresoScroll()
  useAnimaciones(pagina)
  useScrollPagina(pagina, ancla)

  return (
    <>
      <Header pagina={pagina} />
      <main id="contenido" tabIndex={-1} key={pagina}>
        <Pagina />
      </main>
      <Pie />
    </>
  )
}

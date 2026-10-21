import { Chip } from './Comunes.jsx'

export default function MisionVision() {
  return (
    <section className="seccion-isla" aria-label="Misión y visión">
      <div className="isla mision" data-isla>
        <span className="isla__brillo isla__brillo--der" aria-hidden="true" />
        <div className="contenedor mision__rejilla">
          <div className="mision__bloque">
            <Chip claro>Misión</Chip>
            <p data-llenar>
              Brindar soluciones energéticas sostenibles a través de sistemas solares fotovoltaicos y solares
              térmicos, contribuyendo al ahorro económico, al cuidado del medio ambiente y al bienestar de las
              comunidades, con un servicio confiable, innovador y de alta calidad.
            </p>
          </div>
          <div className="mision__bloque">
            <Chip claro>Visión</Chip>
            <p data-llenar>
              Ser una empresa líder en energías limpias en Colombia, reconocida por su compromiso con la
              sostenibilidad, la innovación tecnológica y la transformación positiva de los hogares, empresas y
              comunidades hacia un futuro energético responsable.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

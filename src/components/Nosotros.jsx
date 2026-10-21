export default function Nosotros() {
  return (
    <section className="seccion nosotros" id="nosotros">
      <div className="contenedor nosotros__rejilla">
        <div className="nosotros__texto">
          <h2 className="sr">Quiénes somos</h2>
          <p className="destacado">
            Somos una empresa especializada en el diseño, instalación y mantenimiento de sistemas solares
            fotovoltaicos y sistemas solares térmicos.
          </p>
          <p>
            Ofrecemos soluciones energéticas sostenibles, eficientes y personalizadas para hogares, empresas e
            instituciones. Soltherra acompaña a sus clientes desde la ingeniería hasta la puesta en marcha,
            garantizando cumplimiento normativo, ahorro económico y reducción del impacto ambiental.
          </p>
        </div>
        <figure className="foto foto--vertical nosotros__foto">
          <img
            src="/img/cableado.webp"
            alt="Técnico ajustando las conexiones de un inversor solar"
            width="900"
            height="1200"
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  )
}

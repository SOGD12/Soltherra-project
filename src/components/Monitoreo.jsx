// Dos videos: el vertical para móvil y el horizontal para el resto. CSS muestra solo uno
// y preload="none" evita descargar el que no se ve.
export default function Monitoreo() {
  return (
    <section className="seccion monitoreo" id="monitoreo" aria-labelledby="t-monitoreo">
      <div className="contenedor">
        <div className="monitoreo__texto">
          <h2 id="t-monitoreo" data-titulo>
            Monitorización en <em className="acento">tiempo real</em>
          </h2>
        </div>
        <div className="monitoreo__video">
          <video
            className="monitoreo__v monitoreo__v--escritorio"
            controls
            playsInline
            preload="none"
            poster="/video/monitoreo-escritorio.webp"
            width="1920"
            height="1080"
            aria-label="Demostración de la aplicación de monitorización, versión de escritorio"
          >
            <source src="/video/monitoreo-escritorio.mp4" type="video/mp4" />
            <a href="/video/monitoreo-escritorio.mp4">Descargar el video de demostración</a>
          </video>
          <video
            className="monitoreo__v monitoreo__v--movil"
            controls
            playsInline
            preload="none"
            poster="/video/monitoreo-movil.webp"
            width="1080"
            height="1920"
            aria-label="Demostración de la aplicación de monitorización, versión móvil"
          >
            <source src="/video/monitoreo-movil.mp4" type="video/mp4" />
            <a href="/video/monitoreo-movil.mp4">Descargar el video de demostración</a>
          </video>
        </div>
      </div>
    </section>
  )
}

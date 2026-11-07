import { CORREO, DIRECCION } from '../data/contenido.js'

// Política de tratamiento de datos personales (Ley 1581 de 2012 y Decreto 1377 de 2013 de Colombia;
// buenas prácticas de ISO/IEC 27701). Debe mantenerse igual a lo que hace el formulario de Contacto.
export default function Privacidad() {
  return (
    <section className="legal">
      <div className="contenedor legal__texto">
        <h1>Política de privacidad</h1>
        <p>Última actualización: noviembre de 2026.</p>

        <h2>Quién es el responsable</h2>
        <p>
          Soltherra S.A.S., {DIRECCION}. Correo para temas de datos personales:{' '}
          <a href={`mailto:${CORREO}`}>{CORREO}</a>.
        </p>

        <h2>Qué datos usamos y para qué</h2>
        <p>
          Solo los que escribes en el formulario de contacto: tu nombre, el servicio que te interesa y, si quieres, un
          mensaje. Los usamos únicamente para responderte y enviarte una cotización.
        </p>

        <h2>Dónde quedan tus datos</h2>
        <p>
          Esta página no guarda lo que escribes. Al enviar el formulario se abre WhatsApp con tu mensaje ya escrito, y
          el envío lo haces tú. Desde ese momento el mensaje lo trata WhatsApp según sus propias condiciones, y nosotros
          lo conservamos en nuestro WhatsApp solo el tiempo necesario para atenderte.
        </p>

        <h2>Consentimiento</h2>
        <p>
          Antes de enviar el formulario debes marcar la casilla de autorización. Sin ella no se genera el mensaje. Puedes
          retirar tu autorización cuando quieras.
        </p>

        <h2>Cookies y medición</h2>
        <p>
          No usamos cookies de publicidad ni de seguimiento. Medimos las visitas con Google Analytics, que cuenta
          páginas vistas de forma agregada, sin cookies y sin identificarte. El mapa de la página de contacto lo carga
          Google Maps.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Puedes conocer, actualizar, rectificar y pedir que suprimamos tus datos, y revocar tu autorización
          (Ley 1581 de 2012). Escríbenos a <a href={`mailto:${CORREO}`}>{CORREO}</a> y respondemos en un máximo de quince
          días hábiles. También puedes acudir a la Superintendencia de Industria y Comercio.
        </p>

        <h2>Seguridad</h2>
        <p>
          La página se sirve solo por HTTPS y con cabeceras de seguridad. Para reportar una falla de seguridad, escribe
          a <a href={`mailto:${CORREO}`}>{CORREO}</a>.
        </p>
      </div>
    </section>
  )
}

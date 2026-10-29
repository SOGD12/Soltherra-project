export const TEL = '+57 313 813 0046'
export const WA = 'https://wa.me/573138130046'
export const CORREO = 'soltherra23@gmail.com'
export const DIRECCION = 'Calle 28 N° 86 - 70, Cali'
export const wa = (texto) => `${WA}?text=${encodeURIComponent(texto)}`
export const MAPA =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248.93033764012515!2d-76.5238692265609!3d3.3781739830128097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a11313ec31c5%3A0x2c183a56456f74e5!2sCl.%2028%20%2386-70%2C%20Comuna%2017%2C%20Cali%2C%20Valle%20del%20Cauca!5e0!3m2!1ses-419!2sco!4v1770853641815!5m2!1ses-419!2sco'
export const INSTAGRAM = 'https://www.instagram.com/soltherra_energiasostenible/'
export const FACEBOOK = 'https://web.facebook.com/profile.php?id=61587216064854'
export const MENSAJE = 'Hola Soltherra, quiero cotizar un sistema solar.'

export const nav = [
  ['Inicio', '/home'],
  ['Servicios', '/servicios'],
  ['Cómo funciona', '/como-funciona'],
  ['Trabajos', '/trabajos'],
  ['Contacto', '/contacto'],
]

export const gestiones = [
  {
    icono: 'engineering',
    titulo: 'Ingeniería detallada',
    texto: 'Ingeniería detallada para proyectos solares, adaptada a hogares, empresas e instituciones.',
  },
  {
    icono: 'description',
    titulo: 'Conexión ante el operador de red',
    texto: 'Trámites de conexión ante el operador de red para que el sistema opere con cumplimiento normativo.',
  },
  {
    icono: 'assignment_turned_in',
    titulo: 'Estudio de conexión simplificada',
    texto: 'Estudio de conexión simplificada para sistemas solares fotovoltaicos (AGPE y GD).',
  },
  {
    icono: 'receipt_long',
    titulo: 'Beneficios tributarios',
    texto: 'Trámites para acceder a los beneficios tributarios de la energía solar.',
  },
]

export const fotovoltaico = [
  'Ingeniería detallada para proyectos solares',
  'Trámites de conexión ante el operador de red',
  'Estudio de conexión simplificada para sistemas solares fotovoltaicos (AGPE y GD)',
  'Instalación y puesta en marcha con cumplimiento normativo',
]

export const termico = [
  'Calentamiento de aguas sanitarias con sistemas solares térmicos',
  'Colectores y tanques dimensionados al consumo de agua caliente',
  'Climatización de ambientes con energía solar térmica',
]

export const piscina = [
  'Diseño del sistema según el tamaño y uso de la piscina',
  'Colectores solares térmicos y equipo de bombeo',
  'Instalación y puesta en marcha',
  'Temperatura agradable durante todo el año, sin gastar en gas o electricidad',
]

export const mantenimiento = [
  'Mantenimiento preventivo y correctivo de sistemas fotovoltaicos',
  'Mantenimiento de sistemas solares térmicos',
  'Revisión del cableado, conexiones e inversor',
  'Mediciones eléctricas y monitoreo del rendimiento',
]

export const cargaEV = [
  'Diseño e instalación de puestos de carga para vehículos eléctricos',
  'Cargadores para casas, edificios, empresas y parqueaderos',
  'Carga alimentada con energía solar para movilidad limpia',
  'Protecciones eléctricas, puesta en marcha y cumplimiento normativo',
]

export const tramites = [
  'Deducción especial de renta por tus inversiones en energía solar',
  'Exclusión de IVA en equipos y servicios del proyecto',
  'Exención de aranceles en la importación de equipos',
  'Depreciación acelerada de los activos del sistema',
]

export const pasos = [
  { icono: 'engineering', titulo: 'Ingeniería', texto: 'Diseñamos la solución solar según tu hogar, empresa o institución.' },
  {
    icono: 'description',
    titulo: 'Trámites',
    texto: 'Gestionamos la conexión ante el operador de red y los beneficios tributarios.',
  },
  { icono: 'solar_power', titulo: 'Instalación', texto: 'Instalamos y ponemos en marcha el sistema fotovoltaico o térmico.' },
  {
    icono: 'build',
    titulo: 'Mantenimiento',
    texto: 'Mantenimiento preventivo y correctivo para que el sistema siga rindiendo.',
  },
]

// Historia de la escena 3D: cada paso ocupa una parte del recorrido de scroll.
export const historia = [
  { icono: 'light_mode', titulo: 'Llega el sol', texto: 'La radiación solar cae sobre los módulos instalados en tu cubierta.' },
  { icono: 'solar_power', titulo: 'El panel la convierte', texto: 'Las celdas fotovoltaicas transforman la luz en electricidad.' },
  {
    icono: 'electrical_services',
    titulo: 'El inversor la adapta',
    texto: 'El inversor deja la energía lista para los equipos de tu hogar, empresa o institución.',
  },
  { icono: 'home', titulo: 'Tu casa se enciende', texto: 'Usas energía limpia y dependes menos de la red eléctrica.' },
]

export const beneficios = [
  { icono: 'trending_down', texto: 'Reducción significativa en costos de energía.' },
  { icono: 'eco', texto: 'Contribución directa al cuidado del medio ambiente.' },
  { icono: 'verified_user', texto: 'Cumplimiento total de normativas técnicas y legales.' },
  { icono: 'tune', texto: 'Soluciones personalizadas según cada necesidad.' },
  { icono: 'savings', texto: 'Mayor independencia energética y retorno de inversión.' },
]

export const soluciones = [
  {
    clase: 'bento__tarjeta--a',
    titulo: 'Sistemas fotovoltaicos',
    href: '/servicios#servicios',
    imagen: 'fotovoltaicos',
  },
  {
    clase: 'bento__tarjeta--b',
    titulo: 'Sistemas solares térmicos',
    href: '/servicios#termico',
    imagen: 'termicos',
  },
  {
    clase: 'bento__tarjeta--c',
    titulo: 'Mantenimiento',
    href: '/servicios#mantenimiento',
    imagen: 'mantenimiento',
  },
  {
    clase: 'bento__tarjeta--d',
    titulo: 'Trámites y conexión',
    href: '/servicios#tramites',
    imagen: 'tramites',
  },
  {
    clase: 'bento__tarjeta--e',
    titulo: 'Carga de vehículos eléctricos',
    href: '/servicios#carga-ev',
    imagen: 'carga-ev',
  },
]

export const categorias = [
  ['fotovoltaico', 'Fotovoltaico', 'solar_power'],
  ['termico', 'Térmico', 'thermostat'],
  ['piscina', 'Climatización de piscina', 'pool'],
  ['mantenimiento', 'Mantenimiento y medición', 'build'],
  ['ev', 'Carga de vehículos eléctricos', 'ev_station'],
]

export const cinta = [
  'Sistemas fotovoltaicos',
  'Climatización de piscinas',
  'Calentamiento de agua sanitaria',
  'Ingeniería detallada',
  'Trámites ante el operador de red',
  'Beneficios tributarios',
  'Mantenimiento preventivo y correctivo',
]

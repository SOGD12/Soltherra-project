import call from '@material-symbols/svg-400/outlined/call.svg?raw'
import mail from '@material-symbols/svg-400/outlined/mail.svg?raw'
import location_on from '@material-symbols/svg-400/outlined/location_on.svg?raw'
import solar_power from '@material-symbols/svg-400/outlined/solar_power.svg?raw'
import thermostat from '@material-symbols/svg-400/outlined/thermostat.svg?raw'
import water_drop from '@material-symbols/svg-400/outlined/water_drop.svg?raw'
import engineering from '@material-symbols/svg-400/outlined/engineering.svg?raw'
import description from '@material-symbols/svg-400/outlined/description.svg?raw'
import receipt_long from '@material-symbols/svg-400/outlined/receipt_long.svg?raw'
import assignment_turned_in from '@material-symbols/svg-400/outlined/assignment_turned_in.svg?raw'
import bolt from '@material-symbols/svg-400/outlined/bolt.svg?raw'
import build from '@material-symbols/svg-400/outlined/build.svg?raw'
import check_circle from '@material-symbols/svg-400/outlined/check_circle.svg?raw'
import arrow_forward from '@material-symbols/svg-400/outlined/arrow_forward.svg?raw'
import close from '@material-symbols/svg-400/outlined/close.svg?raw'
import eco from '@material-symbols/svg-400/outlined/eco.svg?raw'
import savings from '@material-symbols/svg-400/outlined/savings.svg?raw'
import verified_user from '@material-symbols/svg-400/outlined/verified_user.svg?raw'
import tune from '@material-symbols/svg-400/outlined/tune.svg?raw'
import trending_down from '@material-symbols/svg-400/outlined/trending_down.svg?raw'
import open_in_new from '@material-symbols/svg-400/outlined/open_in_new.svg?raw'
import send from '@material-symbols/svg-400/outlined/send.svg?raw'
import home from '@material-symbols/svg-400/outlined/home.svg?raw'
import apartment from '@material-symbols/svg-400/outlined/apartment.svg?raw'
import account_balance from '@material-symbols/svg-400/outlined/account_balance.svg?raw'
import ev_station from '@material-symbols/svg-400/outlined/ev_station.svg?raw'
import pool from '@material-symbols/svg-400/outlined/pool.svg?raw'
import handyman from '@material-symbols/svg-400/outlined/handyman.svg?raw'
import energy_savings_leaf from '@material-symbols/svg-400/outlined/energy_savings_leaf.svg?raw'
import arrow_back from '@material-symbols/svg-400/outlined/arrow_back.svg?raw'
import arrow_outward from '@material-symbols/svg-400/outlined/arrow_outward.svg?raw'
import monitoring from '@material-symbols/svg-400/outlined/monitoring.svg?raw'
import light_mode from '@material-symbols/svg-400/outlined/light_mode.svg?raw'
import electrical_services from '@material-symbols/svg-400/outlined/electrical_services.svg?raw'
import south from '@material-symbols/svg-400/outlined/south.svg?raw'
import rotate_360 from '@material-symbols/svg-400/outlined/360.svg?raw'

const iconos = {
  call,
  mail,
  location_on,
  solar_power,
  thermostat,
  water_drop,
  engineering,
  description,
  receipt_long,
  assignment_turned_in,
  bolt,
  build,
  check_circle,
  arrow_forward,
  close,
  eco,
  savings,
  verified_user,
  tune,
  trending_down,
  open_in_new,
  send,
  home,
  apartment,
  account_balance,
  ev_station,
  pool,
  handyman,
  energy_savings_leaf,
  monitoring,
  arrow_outward,
  arrow_back,
  light_mode,
  electrical_services,
  south,
  rotate_360,
}

// Material Symbols (Google), estilo outlined 400, en SVG en línea: sin fuente externa ni peticiones extra.
export function Icono({ nombre, className = '' }) {
  return (
    <span
      className={`mi ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: iconos[nombre] }}
    />
  )
}

// Logo oficial de WhatsApp (relleno), el mismo que ya usaba el sitio.
export function IconoWhatsApp() {
  return (
    <svg className="ico" viewBox="-1 -1 26 26" overflow="visible" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  )
}

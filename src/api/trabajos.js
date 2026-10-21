import datos from '../data/trabajos.json'

// Fuente unica de "Nuestros trabajos". Hoy lee el JSON local (src/data/trabajos.json).
// Para pasar a una API real, cambia el cuerpo por:
//   const r = await fetch('https://tu-api/trabajos'); return r.json()
// El resto de la pagina no cambia mientras cada obra conserve estos campos:
//   id, cliente, titulo, foto, alt, ancho, alto, posicion ('a' a 'e', lugar en la galeria).
export async function obtenerTrabajos() {
  return datos
}

export const trabajosIniciales = datos

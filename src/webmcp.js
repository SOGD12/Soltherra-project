import { TEL, TEL2, CORREO, DIRECCION, WA, wa } from './data/contenido.js'
import { PAGINAS, navegar } from './ruta.js'

// WebMCP: expone herramientas a agentes del navegador (navigator.modelContext). Si el navegador no lo soporta, no hace nada.
// Solo lectura y navegación: no envía datos ni escribe nada por la persona; el contacto se hace por un enlace de WhatsApp.
const respuesta = (datos) => ({ content: [{ type: 'text', text: JSON.stringify(datos) }] })

export function registrarHerramientasWebMCP() {
  const contexto = typeof navigator === 'undefined' ? null : navigator.modelContext
  if (!contexto?.registerTool) return

  const herramientas = [
    {
      name: 'obtener_datos_de_contacto',
      description: 'Devuelve el teléfono, WhatsApp, correo y dirección de Soltherra S.A.S. (energía solar en Cali, Colombia).',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => respuesta({ telefono: TEL, telefono2: TEL2, whatsapp: WA, correo: CORREO, direccion: DIRECCION }),
    },
    {
      name: 'ir_a_pagina',
      description: 'Abre una página del sitio de Soltherra: inicio, servicios, como-funciona, trabajos, contacto, privacidad o terminos.',
      inputSchema: {
        type: 'object',
        properties: { pagina: { type: 'string', enum: PAGINAS, description: 'Página a abrir' } },
        required: ['pagina'],
      },
      execute: async ({ pagina }) => {
        if (!PAGINAS.includes(pagina)) return respuesta({ error: 'Página desconocida', paginas: PAGINAS })
        navegar(pagina === 'inicio' ? '/' : `/${pagina}`)
        return respuesta({ ok: true, pagina })
      },
    },
    {
      name: 'enlace_de_cotizacion_whatsapp',
      description: 'Devuelve un enlace de WhatsApp con un mensaje ya escrito para pedir una cotización de energía solar. La persona decide si lo abre y lo envía.',
      inputSchema: {
        type: 'object',
        properties: { servicio: { type: 'string', description: 'Servicio de interés, por ejemplo "paneles solares"' } },
      },
      annotations: { readOnlyHint: true },
      execute: async ({ servicio } = {}) =>
        respuesta({ url: wa(`Hola Soltherra, quiero una cotización${servicio ? ` de ${String(servicio).slice(0, 120)}` : ''}.`) }),
    },
  ]
  for (const herramienta of herramientas) {
    try {
      contexto.registerTool(herramienta)
    } catch {
      // ya registrada (p. ej. recarga en desarrollo)
    }
  }
}

import { TEL, TEL2, CORREO, DIRECCION, WA, wa } from './data/contenido.js'
import { PAGINAS, navegar } from './ruta.js'

// WebMCP: exposes tools to in-browser agents (navigator.modelContext). Does nothing if the browser lacks support.
// Read-only and navigation only: it never submits data on the visitor's behalf; contact goes through a WhatsApp link.
const reply = (data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })

export function registerWebMcpTools() {
  const context = typeof navigator === 'undefined' ? null : navigator.modelContext
  if (!context?.registerTool) return

  const tools = [
    {
      name: 'get_contact_details',
      description: 'Returns the phone numbers, WhatsApp link, email and address of Soltherra S.A.S. (solar energy company in Cali, Colombia).',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => reply({ phone: TEL, phone2: TEL2, whatsapp: WA, email: CORREO, address: DIRECCION }),
    },
    {
      name: 'go_to_page',
      description: 'Opens a page of the Soltherra website: inicio (home), servicios, como-funciona, trabajos, contacto, privacidad or terminos.',
      inputSchema: {
        type: 'object',
        properties: { page: { type: 'string', enum: PAGINAS, description: 'Page to open' } },
        required: ['page'],
      },
      execute: async ({ page }) => {
        if (!PAGINAS.includes(page)) return reply({ error: 'Unknown page', pages: PAGINAS })
        navegar(page === 'inicio' ? '/' : `/${page}`)
        return reply({ ok: true, page })
      },
    },
    {
      name: 'get_whatsapp_quote_link',
      description: 'Returns a WhatsApp link with a prefilled message to request a solar energy quote. The person decides whether to open and send it.',
      inputSchema: {
        type: 'object',
        properties: { service: { type: 'string', description: 'Service of interest, for example "solar panels"' } },
      },
      annotations: { readOnlyHint: true },
      execute: async ({ service } = {}) =>
        reply({ url: wa(`Hola Soltherra, quiero una cotización${service ? ` de ${String(service).slice(0, 120)}` : ''}.`) }),
    },
  ]
  for (const tool of tools) {
    try {
      context.registerTool(tool)
    } catch {
      // already registered (e.g. hot reload in development)
    }
  }
}

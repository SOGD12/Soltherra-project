import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { createServer, defineConfig, loadEnv } from 'vite'
import { SEO, DOMINIO_POR_DEFECTO as SEO_DOMINIO } from './src/seo.js'

const DOMINIO_POR_DEFECTO = SEO_DOMINIO

// SEO que depende del dominio: canonical, sitemap.xml y robots.txt. El dominio sale de VITE_SITE_URL
// (ej. https://soltherra.com en .env.production); si no existe se usa el de Vercel que ya está en index.html.
function seo(siteUrl) {
  const base = (siteUrl || DOMINIO_POR_DEFECTO).replace(/\/$/, '')
  return {
    name: 'soltherra-seo',
    transformIndexHtml(html) {
      return html
        .replaceAll(DOMINIO_POR_DEFECTO, base)
        .replace('<link rel="icon"', `<link rel="canonical" href="${base}/" />\n    <link rel="icon"`)
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
      })
      const urls = Object.values(SEO).map(({ ruta }) => `  <url><loc>${base}${ruta}</loc></url>`)
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
      })
    },
  }
}

// Pre-renderiza cada página al compilar: el HTML ya trae títulos y textos, sin esperar al JavaScript.
// Buscadores y vistas previas de redes lo leen directo; en el navegador React lo hidrata (ver src/main.jsx).
// index.html lleva el inicio; las demás páginas se escriben como servicios.html, trabajos.html, etc. (vercel.json
// usa cleanUrls, así que /servicios sirve servicios.html) con su propio título, descripción y canonical.
const renders = {}

function prerender() {
  return {
    name: 'soltherra-prerender',
    apply: 'build',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const servidor = await createServer({
          configFile: false,
          plugins: [react()],
          server: { middlewareMode: true },
          appType: 'custom',
          logLevel: 'error',
        })
        try {
          const { render } = await servidor.ssrLoadModule('/src/entry-server.jsx')
          for (const pagina of Object.keys(SEO)) renders[pagina] = render(pagina)
        } finally {
          await servidor.close()
        }
        return html.replace('<div id="root"></div>', `<div id="root">${renders.inicio}</div>`)
      },
    },
  }
}

function paginas() {
  let final = ''
  let salida = 'dist'
  const poner = (html, patron, valor) => html.replace(patron, (_, antes) => `${antes}${valor}`)
  return {
    name: 'soltherra-paginas',
    apply: 'build',
    configResolved: (config) => {
      salida = config.build.outDir
    },
    transformIndexHtml: { order: 'post', handler: (html) => ((final = html), html) },
    closeBundle() {
      const base = final.match(/<link rel="canonical" href="([^"]*?)\/"/)[1]
      for (const [pagina, { titulo, descripcion, ruta }] of Object.entries(SEO)) {
        let html = final.split(renders.inicio).join(renders[pagina])
        html = html.replace(/<title>[^<]*<\/title>/, `<title>${titulo}</title>`)
        html = poner(html, /(<meta (?:name="title"|property="og:title"|name="twitter:title") content=")[^"]*/g, titulo)
        html = poner(html, /(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*/g, descripcion)
        const url = base + ruta
        html = poner(html, /(<meta (?:property="og:url"|name="twitter:url") content=")[^"]*/g, url)
        html = poner(html, /(<link rel="canonical" href=")[^"]*/, url)
        const archivos = pagina === 'inicio' ? ['home'] : [pagina]
        for (const nombre of archivos) writeFileSync(`${salida}/${nombre}.html`, html)
      }
    },
  }
}

// Cabeceras de seguridad: vercel.json es la fuente única. Aquí se usan para dos cosas:
//  - `vite preview` las envía igual que producción, así la CSP se puede probar en local.
//  - Al compilar se comprueba que cada script en línea de index.html tenga su hash en la CSP; si alguien edita
//    ese script sin actualizar el hash, el navegador lo bloquearía en producción y el build avisa antes.
function cabeceras() {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'))
  const globales = Object.fromEntries(config.headers.find((h) => h.source === '/(.*)').headers.map((h) => [h.key, h.value]))
  return {
    name: 'soltherra-cabeceras',
    config: () => ({ preview: { headers: globales } }),
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (ctx.server) return html
        for (const [, js] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
          const hash = `'sha256-${createHash('sha256').update(js).digest('base64')}'`
          if (!globales['Content-Security-Policy'].includes(hash)) {
            throw new Error(`El script en línea de index.html cambió: actualiza su hash en la CSP de vercel.json a ${hash}`)
          }
        }
        return html
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return { plugins: [react(), prerender(), seo(env.VITE_SITE_URL ?? ''), cabeceras(), paginas()] }
})

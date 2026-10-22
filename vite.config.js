import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { createServer, defineConfig, loadEnv } from 'vite'

// Dominio escrito en index.html (og:url, og:image, twitter:*). Con VITE_SITE_URL se reemplaza en todo el HTML.
const DOMINIO_POR_DEFECTO = 'https://soltherra.vercel.app'

// SEO que depende del dominio. Se activa al definir VITE_SITE_URL (ej. https://soltherra.com) en .env.production.
// Sin dominio solo se emite un robots.txt básico, para no publicar URLs inventadas.
function seo(siteUrl) {
  const base = siteUrl.replace(/\/$/, '')
  return {
    name: 'soltherra-seo',
    transformIndexHtml(html) {
      if (!base) return html
      return html
        .replaceAll(DOMINIO_POR_DEFECTO, base)
        .replace('<link rel="icon"', `<link rel="canonical" href="${base}/" />\n    <link rel="icon"`)
        .replace(/(content|href)="\/img\/hero\.webp"(?! fetchpriority)/g, `$1="${base}/img/hero.webp"`)
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n${base ? `\nSitemap: ${base}/sitemap.xml\n` : ''}`,
      })
      if (base) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}/</loc></url>\n</urlset>\n`,
        })
      }
    },
  }
}

// Pre-renderiza la página al compilar: el HTML ya trae títulos y textos, sin esperar al JavaScript.
// Buscadores y vistas previas de redes lo leen directo; en el navegador React lo hidrata (ver src/main.jsx).
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
          return html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
        } finally {
          await servidor.close()
        }
      },
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
  return { plugins: [react(), prerender(), seo(env.VITE_SITE_URL ?? ''), cabeceras()] }
})

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// SEO que depende del dominio. Se activa al definir VITE_SITE_URL (ej. https://soltherra.com) en .env.production.
// Sin dominio solo se emite un robots.txt básico, para no publicar URLs inventadas.
function seo(siteUrl) {
  const base = siteUrl.replace(/\/$/, '')
  return {
    name: 'soltherra-seo',
    transformIndexHtml(html) {
      if (!base) return html
      return html
        .replace('<link rel="icon"', `<link rel="canonical" href="${base}/" />\n    <meta property="og:url" content="${base}/" />\n    <link rel="icon"`)
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

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return { plugins: [react(), seo(env.VITE_SITE_URL ?? '')] }
})

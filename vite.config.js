import { createHash } from 'node:crypto'
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { createServer, defineConfig, loadEnv } from 'vite'
import { SEO, DOMINIO_POR_DEFECTO as SEO_DOMINIO, datosEstructurados } from './src/seo.js'

const DOMINIO_POR_DEFECTO = SEO_DOMINIO

// SEO que depende del dominio: canonical, sitemap.xml y robots.txt. El dominio sale de VITE_SITE_URL
// (ej. https://soltherra.co en .env.production); si no existe se usa https://soltherra.co, que ya está en index.html.
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
        source: `User-agent: *\nAllow: /\nContent-Signal: search=yes, ai-input=yes, ai-train=no\n\nSitemap: ${base}/sitemap.xml\n`,
      })
      // lastmod: fecha del último commit (cambia solo cuando el sitio cambia); sin git, la fecha del build.
      let lastmod = new Date().toISOString().slice(0, 10)
      try {
        lastmod = execSync('git log -1 --format=%cs', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || lastmod
      } catch {
        // sin git: se queda la fecha del build
      }
      const urls = Object.values(SEO).map(({ ruta }) => `  <url><loc>${base}${ruta}</loc><lastmod>${lastmod}</lastmod></url>`)
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
// index.html lleva el inicio; las demás páginas se escriben como servicios.html, trabajos.html, etc. (el .htaccess
// que genera cabeceras() hace que /servicios sirva servicios.html) con su propio título, descripción y canonical.
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

// HTML pre-renderizado -> Markdown sencillo, para los agentes que piden `Accept: text/markdown` (ver .htaccess).
const ENTIDADES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&nbsp;': ' ', '&#x27;': "'", '&#39;': "'" }
function aMarkdown(html, base) {
  return html
    .replace(/<(svg|script|style|button|header|picture|video)\b[\s\S]*?<\/\1>/g, '')
    .replace(/<img\b[^>]*>/g, '')
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g, (_, n, t) => `\n\n${'#'.repeat(n)} ${t.replace(/<[^>]+>/g, '')}\n\n`)
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, (_, h, t) => {
      const texto = t.replace(/<[^>]+>/g, '').trim()
      return texto ? `[${texto}](${h.startsWith('/') ? base + h : h})` : ''
    })
    .replace(/<li\b[^>]*>/g, '\n- ')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/(p|div|section|ul|ol|footer|figure|article|nav|form)>/g, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(?:amp|lt|gt|quot|nbsp|#x27|#39);/g, (e) => ENTIDADES[e])
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function paginas() {
  let salida = 'dist'
  const poner = (html, patron, valor) => html.replace(patron, (_, antes) => `${antes}${valor}`)
  return {
    name: 'soltherra-paginas',
    apply: 'build',
    configResolved: (config) => {
      salida = config.build.outDir
    },
    closeBundle() {
      // Se parte del index.html ya escrito en disco: ahí Vite ya resolvió las rutas de los srcset
      // (en transformIndexHtml todavía llevan marcadores __VITE_PUBLIC_ASSET__).
      const final = readFileSync(`${salida}/index.html`, 'utf8')
      if (!final.includes(renders.inicio)) throw new Error('soltherra-paginas: el HTML final no contiene el inicio pre-renderizado')
      const base = final.match(/<link rel="canonical" href="([^"]*?)\/"/)[1]
      for (const [pagina, { titulo, descripcion, ruta }] of Object.entries(SEO)) {
        let html = final.split(renders.inicio).join(renders[pagina])
        // El <title> (texto de la pestaña) es fijo en todo el sitio, el de index.html; el título de cada página va en og/twitter.
        html = poner(html, /(<meta (?:name="title"|property="og:title"|name="twitter:title") content=")[^"]*/g, titulo)
        html = poner(html, /(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*/g, descripcion)
        const url = base + ruta
        html = poner(html, /(<meta (?:property="og:url"|name="twitter:url") content=")[^"]*/g, url)
        html = poner(html, /(<link rel="canonical" href=")[^"]*/, url)
        const scripts = datosEstructurados(pagina, base).map((d) => `<script type="application/ld+json">${JSON.stringify(d)}</script>`)
        const md = pagina === 'inicio' ? 'index' : pagina
        const alterna = `<link rel="alternate" type="text/markdown" href="${base}/${md}.md" />`
        html = html.replace('</head>', `${alterna}\n${scripts.join('\n')}\n</head>`)
        writeFileSync(`${salida}/${md}.md`, `# ${titulo}\n\n> ${descripcion}\n\nFuente: ${url}\n\n${aMarkdown(renders[pagina], base)}\n`)
        // El inicio es index.html; las demás se escriben como servicios.html, trabajos.html, etc.
        writeFileSync(`${salida}/${pagina === 'inicio' ? 'index' : pagina}.html`, html)
      }
      const enlaces = Object.values(SEO).map(({ ruta, titulo, descripcion }) => `- [${titulo}](${base}${ruta}): ${descripcion}`)
      writeFileSync(
        `${salida}/llms.txt`,
        `# Soltherra S.A.S.

> Empresa de energía solar en Cali, Colombia: diseño, instalación y mantenimiento de sistemas solares fotovoltaicos y solares térmicos, climatización solar de piscinas y puntos de carga para vehículos eléctricos, para hogares, empresas e instituciones en Cali y el Valle del Cauca.

## Páginas

${enlaces.join('\n')}

## Contacto

- WhatsApp: +57 313 813 0046
- Dirección: Calle 28 # 86-70, Cali, Valle del Cauca, Colombia

## Más

- [Sitemap](${base}/sitemap.xml)
- Cada página tiene versión en Markdown: pídela con la cabecera "Accept: text/markdown" o añade .md a la ruta (inicio: ${base}/index.md).
- Uso del contenido: ver Content-Signal en robots.txt.
`,
      )
    },
  }
}

// Cabeceras de seguridad: esta es la fuente única. Se usan para tres cosas:
//  - Al compilar se escribe dist/.htaccess (Hostinger / LiteSpeed) con estas cabeceras, la caché y las rutas limpias.
//  - `vite preview` las envía igual que producción, así la CSP se puede probar en local.
//  - Se comprueba que cada script en línea de index.html tenga su hash en la CSP; si alguien edita
//    ese script sin actualizar el hash, el navegador lo bloquearía en producción y el build avisa antes.
const CABECERAS = {
  'Content-Security-Policy':
    // Google Tag Manager + Google Analytics 4 (solo se cargan con consentimiento, ver src/analitica.js).
    "default-src 'self'; script-src 'self' 'sha256-Du+OJKJSbdUgz5nrHeWWINvez6XKDDU/tyj/5c2uvwo=' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com; font-src 'self' data:; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; frame-src https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
  'Strict-Transport-Security': 'max-age=63072000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

// Al recargar /servicios el servidor busca un archivo "servicios" que no existe y daba 404.
// Con estas reglas sirve servicios.html (pre-renderizada) y cualquier otra ruta cae en index.html.
const htaccess = () => `# Generado por vite.config.js al compilar: no editar a mano.
Options -MultiViews
DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Una sola versión del sitio: www -> sin www
  RewriteCond %{HTTP_HOST} ^www\\.soltherra\\.co$ [NC]
  RewriteRule ^ https://soltherra.co%{REQUEST_URI} [R=301,L]

  # Inicio duplicado: /home, /home.html y /index.html -> /
  RewriteRule ^home(\\.html)?/?$ / [R=301,L]
  RewriteCond %{THE_REQUEST} \\s/index\\.html[\\s?]
  RewriteRule ^ / [R=301,L]

  # /servicios.html -> /servicios
  RewriteCond %{THE_REQUEST} \\s/([^.?\\s]+)\\.html[\\s?]
  RewriteRule ^ /%1 [R=301,L]

  # Barra final: /servicios/ -> /servicios
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.+)/$ /$1 [R=301,L]

  # Agentes: con "Accept: text/markdown" se sirve la versión en Markdown de la página
  RewriteCond %{HTTP:Accept} text/markdown [NC]
  RewriteRule ^$ index.md [L]
  RewriteCond %{HTTP:Accept} text/markdown [NC]
  RewriteCond %{DOCUMENT_ROOT}/$1.md -f
  RewriteRule ^([^./]+)$ $1.md [L]

  # Rutas limpias: /servicios -> servicios.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{DOCUMENT_ROOT}/$1.html -f
  RewriteRule ^([^./]+)$ $1.html [L]

</IfModule>

# Cualquier otra ruta: el inicio con estado 404 (no un 200 falso para /wp-admin, /.env, etc.)
ErrorDocument 404 /index.html

<IfModule mod_headers.c>
${Object.entries(CABECERAS)
  .map(([clave, valor]) => `  Header always set ${clave} "${valor}"`)
  .join('\n')}

  # RFC 8288: recursos para agentes. El HTML y el Markdown cambian según la cabecera Accept.
  Header always set Link "</llms.txt>; rel=\\"describedby\\"; type=\\"text/plain\\", </sitemap.xml>; rel=\\"sitemap\\"; type=\\"application/xml\\", </index.md>; rel=\\"alternate\\"; type=\\"text/markdown\\""
  Header append Vary Accept

  SetEnvIf Request_URI "^/assets/" CACHE_LARGA
  SetEnvIf Request_URI "^/img/" CACHE_MEDIA
  SetEnvIf Request_URI "^/(favicon\\.ico|icon-192\\.png|apple-touch-icon\\.png|og\\.webp|og-logo\\.png|icons\\.svg|robots\\.txt|sitemap\\.xml|llms\\.txt)$" CACHE_CORTA
  Header set Cache-Control "public, max-age=31536000, immutable" env=CACHE_LARGA
  Header set Cache-Control "public, max-age=604800, stale-while-revalidate=86400" env=CACHE_MEDIA
  Header set Cache-Control "public, max-age=86400" env=CACHE_CORTA

  # El HTML se revalida siempre: tras cada despliegue apunta a los /assets/ nuevos (con hash) y nunca a los borrados.
  AddType "text/markdown; charset=utf-8" .md
  AddType "text/plain; charset=utf-8" .txt
  <FilesMatch "\\.(html|md)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
`

function cabeceras() {
  return {
    name: 'soltherra-cabeceras',
    config: () => ({ preview: { headers: CABECERAS } }),
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: '.htaccess', source: htaccess() })
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (ctx.server) return html
        for (const [, js] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
          const hash = `'sha256-${createHash('sha256').update(js).digest('base64')}'`
          if (!CABECERAS['Content-Security-Policy'].includes(hash)) {
            throw new Error(`El script en línea de index.html cambió: actualiza su hash en la CSP (CABECERAS en vite.config.js) a ${hash}`)
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

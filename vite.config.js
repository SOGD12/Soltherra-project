import { createHash } from 'node:crypto'
import { execSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { createServer, defineConfig, loadEnv } from 'vite'
import { DOMINIO_POR_DEFECTO as SEO_DOMINIO, altSocial, datosEmpresa, datosEstructurados, seoDe, tituloNoEncontrada } from './src/seo.js'
import { HREFLANG, IDIOMAS, LOCALE_OG, PAGINAS, rutaDe, slugDe, versiones } from './src/rutas.js'
import { DIRECCION, TEL } from './src/data/contenido.js'

const DOMINIO_POR_DEFECTO = SEO_DOMINIO

// Una entrada por página e idioma: [{ pagina, idioma }, ...] en el orden de PAGINAS (el inicio en español, primero).
const PAGINAS_POR_IDIOMA = IDIOMAS.flatMap((idioma) => PAGINAS.map((pagina) => ({ pagina, idioma })))
const clave = (pagina, idioma) => `${idioma}:${pagina}`
// Texto seguro dentro de un atributo HTML o de un <title>.
const aHtml = (texto) => texto.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
// Nombre del archivo (sin extensión) de cada página: servicios, en/services... y el inicio es index / en/index.
const archivoDe = (pagina, idioma) => `${idioma === 'en' ? 'en/' : ''}${slugDe(pagina, idioma) || 'index'}`

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
      // Cada URL lleva sus versiones en los dos idiomas (hreflang) y x-default, que es el español.
      const urls = PAGINAS_POR_IDIOMA.map(({ pagina, idioma }) => {
        const alternas = [
          ...versiones(pagina).map((v) => `<xhtml:link rel="alternate" hreflang="${v.hreflang}" href="${base}${v.ruta}"/>`),
          `<xhtml:link rel="alternate" hreflang="x-default" href="${base}${rutaDe(pagina, 'es')}"/>`,
        ]
        return `  <url><loc>${base}${rutaDe(pagina, idioma)}</loc><lastmod>${lastmod}</lastmod>${alternas.join('')}</url>`
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
      })
    },
  }
}

// Pre-renderiza cada página al compilar, en español e inglés: el HTML ya trae títulos y textos, sin esperar al JavaScript.
// Buscadores y vistas previas de redes lo leen directo; en el navegador React lo hidrata (ver src/main.jsx).
// index.html lleva el inicio; las demás páginas se escriben como servicios.html, trabajos.html, etc. y las del inglés
// en en/ (en/index.html, en/services.html...). El .htaccess que genera cabeceras() hace que /servicios y /en/services
// sirvan esos archivos, cada uno con su propio título, descripción y canonical. 404.html es la página de error.
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
          for (const { pagina, idioma } of PAGINAS_POR_IDIOMA) renders[clave(pagina, idioma)] = render(pagina, idioma)
          renders.noencontrada = render('noencontrada', 'es')
        } finally {
          await servidor.close()
        }
        return html.replace('<div id="root"></div>', `<div id="root">${renders[clave('inicio', 'es')]}</div>`)
      },
    },
  }
}

// HTML pre-renderizado -> Markdown sencillo, para los agentes que piden `Accept: text/markdown` (ver .htaccess).
const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&nbsp;': ' ', '&#x27;': "'", '&#39;': "'" }
function toMarkdown(html, base) {
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
    .replace(/&(?:amp|lt|gt|quot|nbsp|#x27|#39);/g, (e) => ENTITIES[e])
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
      const inicio = renders[clave('inicio', 'es')]
      if (!final.includes(inicio)) throw new Error('soltherra-paginas: el HTML final no contiene el inicio pre-renderizado')
      const base = final.match(/<link rel="canonical" href="([^"]*?)\/"/)[1]
      const json = (d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`
      mkdirSync(`${salida}/en`, { recursive: true })

      for (const { pagina, idioma } of PAGINAS_POR_IDIOMA) {
        const { titulo, descripcion, ruta } = seoDe(pagina, idioma)
        let html = final.split(inicio).join(renders[clave(pagina, idioma)])
        html = html.replace('<html lang="es-CO">', `<html lang="${HREFLANG[idioma]}">`)
        // El <title> (texto de la pestaña y del resultado en Google) y las metas de título y descripción de cada página e idioma.
        html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${aHtml(titulo)}</title>`)
        html = poner(html, /(<meta (?:name="title"|property="og:title"|name="twitter:title") content=")[^"]*/g, aHtml(titulo))
        html = poner(html, /(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*/g, aHtml(descripcion))
        html = poner(html, /(<meta (?:property="og:image:alt"|name="twitter:image:alt") content=")[^"]*/g, aHtml(altSocial(idioma)))
        html = poner(html, /(<meta property="og:locale" content=")[^"]*/, LOCALE_OG[idioma])
        const url = base + ruta
        html = poner(html, /(<meta (?:property="og:url"|name="twitter:url") content=")[^"]*/g, url)
        html = poner(html, /(<link rel="canonical" href=")[^"]*/, url)

        // Versiones de la página en cada idioma (hreflang) y el otro idioma para Open Graph.
        const otro = IDIOMAS.find((i) => i !== idioma)
        const alternas = [
          ...versiones(pagina).map((v) => `<link rel="alternate" hreflang="${v.hreflang}" href="${base}${v.ruta}" />`),
          `<link rel="alternate" hreflang="x-default" href="${base}${rutaDe(pagina, 'es')}" />`,
          `<meta property="og:locale:alternate" content="${LOCALE_OG[otro]}" />`,
        ]
        const archivo = archivoDe(pagina, idioma)
        const alternate = `<link rel="alternate" type="text/markdown" href="${base}/${archivo}.md" />`
        const scripts = [datosEmpresa(base, idioma), ...datosEstructurados(pagina, base, idioma)].map(json)
        html = html.replace('</head>', `${alternas.join('\n')}\n${alternate}\n${scripts.join('\n')}\n</head>`)
        writeFileSync(`${salida}/${archivo}.md`, `# ${titulo}\n\n> ${descripcion}\n\nFuente: ${url}\n\n${toMarkdown(renders[clave(pagina, idioma)], base)}\n`)
        // El inicio es index.html; las demás se escriben como servicios.html, trabajos.html, etc. (las del inglés, dentro de en/).
        writeFileSync(`${salida}/${archivo}.html`, html)
      }

      // Página de error: la entrega el servidor con estado 404 (ver ErrorDocument en el .htaccess). Sin indexar y sin canonical.
      let noEncontrada = final.split(inicio).join(renders.noencontrada)
      const tituloError = tituloNoEncontrada('es')
      noEncontrada = noEncontrada.replace(/<title>[^<]*<\/title>/, () => `<title>${aHtml(tituloError)}</title>`)
      noEncontrada = poner(noEncontrada, /(<meta (?:name="title"|property="og:title"|name="twitter:title") content=")[^"]*/g, aHtml(tituloError))
      noEncontrada = noEncontrada.replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, follow" />')
      noEncontrada = noEncontrada.replace(/\s*<link rel="canonical"[^>]*>/, '').replace(/\s*<meta (?:property="og:url"|name="twitter:url")[^>]*>/g, '')
      writeFileSync(`${salida}/404.html`, noEncontrada)

      const links = (idioma) =>
        PAGINAS.map((pagina) => {
          const { ruta, titulo, descripcion } = seoDe(pagina, idioma)
          return `- [${titulo}](${base}${ruta}): ${descripcion}`
        })
      writeFileSync(
        `${salida}/llms.txt`,
        `# Soltherra S.A.S.

> Empresa de energía solar con sede en Cali, Colombia, que instala en todo el país: diseño, instalación y mantenimiento de sistemas solares fotovoltaicos y solares térmicos, climatización solar de piscinas y puntos de carga para vehículos eléctricos, para hogares, empresas e instituciones.

## Páginas

${links('es').join('\n')}

## Pages in English

${links('en').join('\n')}

## Contacto

- WhatsApp: ${TEL}
- Dirección: ${DIRECCION}, Valle del Cauca, Colombia

## Más

- [Sitemap](${base}/sitemap.xml)
- Cada página tiene versión en Markdown: pídela con la cabecera "Accept: text/markdown" o añade .md a la ruta (inicio: ${base}/index.md; inglés: ${base}/en/index.md).
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

  # Una sola versión del sitio: http -> https. Si un proxy o CDN termina el HTTPS, avisa con X-Forwarded-Proto (evita un bucle de redirecciones).
  RewriteCond %{HTTPS} off
  RewriteCond %{HTTP:X-Forwarded-Proto} !https [NC]
  RewriteRule ^ https://soltherra.co%{REQUEST_URI} [R=301,L]

  # Una sola versión del sitio: www -> sin www
  RewriteCond %{HTTP_HOST} ^www\\.soltherra\\.co$ [NC]
  RewriteRule ^ https://soltherra.co%{REQUEST_URI} [R=301,L]

  # Inicio duplicado: /home, /home.html y /index.html -> /  (en inglés: /en/index.html -> /en/)
  RewriteRule ^home(\\.html)?/?$ / [R=301,L]
  RewriteCond %{THE_REQUEST} \\s/index\\.html[\\s?]
  RewriteRule ^ / [R=301,L]
  RewriteCond %{THE_REQUEST} \\s/en/index\\.html[\\s?]
  RewriteRule ^ /en/ [R=301,L]

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
  RewriteCond %{HTTP:Accept} text/markdown [NC]
  RewriteRule ^en/?$ en/index.md [L]
  RewriteCond %{HTTP:Accept} text/markdown [NC]
  RewriteCond %{DOCUMENT_ROOT}/en/$1.md -f
  RewriteRule ^en/([^./]+)$ en/$1.md [L]

  # Rutas limpias: /servicios -> servicios.html y /en/services -> en/services.html (/en/ sirve en/index.html por sí solo)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{DOCUMENT_ROOT}/$1.html -f
  RewriteRule ^([^./]+)$ $1.html [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{DOCUMENT_ROOT}/en/$1.html -f
  RewriteRule ^en/([^./]+)$ en/$1.html [L]

</IfModule>

# Cualquier otra ruta: la página de error (404.html) con estado 404, sin indexar (no un 200 falso para /wp-admin, /.env, etc.)
ErrorDocument 404 /404.html

<IfModule mod_headers.c>
${Object.entries(CABECERAS)
  .map(([clave, valor]) => `  Header always set ${clave} "${valor}"`)
  .join('\n')}

  # RFC 8288: recursos para agentes. El HTML y el Markdown cambian según la cabecera Accept.
  # (La versión en Markdown de cada página va en su <link rel="alternate">, no en una cabecera global.)
  Header always set Link "</llms.txt>; rel=\\"describedby\\"; type=\\"text/plain\\", </sitemap.xml>; rel=\\"sitemap\\"; type=\\"application/xml\\""
  Header append Vary Accept

  SetEnvIf Request_URI "^/assets/" CACHE_LARGA
  SetEnvIf Request_URI "^/(img|video)/" CACHE_MEDIA
  SetEnvIf Request_URI "^/(favicon\\.ico|icon-192\\.png|apple-touch-icon\\.png|og\\.webp|og-logo\\.png|icons\\.svg|robots\\.txt|sitemap\\.xml|llms\\.txt)$" CACHE_CORTA
  Header set Cache-Control "public, max-age=31536000, immutable" env=CACHE_LARGA
  Header set Cache-Control "public, max-age=2592000, stale-while-revalidate=86400" env=CACHE_MEDIA
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

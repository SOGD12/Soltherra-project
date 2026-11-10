# Procedencia de las imágenes

Todas las fotos son de obras reales de Soltherra, tomadas del sitio actual (https://soltherra.now.site/home), alojadas originalmente en imgur. Se descargaron el 2026-10-20 y se convirtieron a WebP (calidad 80, ancho máximo según uso). No hay imágenes generadas por IA en el sitio.

| Archivo | Origen (imgur) |
|---|---|
| hero.webp | WaZtACv.png |
| cableado.webp | PbfOHt7.png |
| inversor.webp | Y26ttGQ.png |
| colectores.webp | Eer1DyE.jpg |
| piscina.webp | qTGeaIk.png (recortada a 1600x640 para la franja panorámica) |
| logo.webp | Logo de Soltherra exportado de Stitch (512 px), con el halo blanco del recorte eliminado (original en `_raw/logo-original.png`). **Pendiente: reemplazar por la versión de alta resolución del cliente.** |

Los originales sin convertir están en `_raw/` en la raíz del proyecto.

## Sección "Nuestros trabajos"

Mismas condiciones (fotos reales del sitio actual, imgur, convertidas a WebP el 2026-10-20):

| Archivo | Origen (imgur) |
|---|---|
| trabajo-cubierta-blanca.webp | bRksMOn.png |
| trabajo-terraza-lago.webp | CEPfSSC.png |
| trabajo-mixto.webp | 9e4nHeZ.png |
| trabajo-tubos.webp | 4v4pkNf.png |

## Carga de vehículos eléctricos (fotos de ejemplo)

Fotos de ejemplo de Unsplash (licencia Unsplash), convertidas a WebP el 2026-10-28. **Pendiente: reemplazar por fotos de instalaciones reales de Soltherra.**

| Archivo | Origen (Unsplash photo id) |
|---|---|

## Cómo están organizadas las carpetas

- `public/img/`: fotos de las secciones del sitio (inicio, servicios, soluciones, cómo funciona). Una sola copia de cada una.
- `public/img/trabajos/`: fotos de la galería «Nuestros trabajos», en una versión más liviana (≈ 900 px de ancho) que la de las secciones. Se listan en `src/data/imagenes/trabajos.json`.

Solo se guardan las imágenes que el código usa. Antes de añadir una, se registra en el `.json` de `src/data/imagenes/` que le corresponde.

## Galería «Nuestros trabajos»: fotovoltaico (agregadas el 2026-11-07)

Fotos de obras de Soltherra entregadas por el equipo y convertidas a WebP (calidad 80, 900 px de ancho en vertical y 1000 px en horizontal), en `public/img/trabajos/`:

| Archivo | Qué muestra |
|---|---|
| fv-inversor-huawei-tablero-dc.webp | Inversor Huawei con tablero DC y canalización |
| fv-inversor-huawei-senalizado.webp | Inversor Huawei señalizado con tablero de protecciones DC |
| fv-inversor-diagrama-unifilar.webp | Inversor con el diagrama unifilar del sistema |
| fv-inversor-bateria-cargador.webp | Inversor, batería y cargador de vehículo eléctrico con tablero |

## Infografías en inglés (sección "Así funciona nuestro sistema")

Versiones en inglés de las cuatro infografías, entregadas por el cliente (2026-11-10), convertidas a WebP (máx. 1500 px). En las tres infografías de diseño se llevó el fondo a blanco puro, igual que en las versiones en español; la del sistema híbrido es una foto y no se tocó. Se muestran al elegir inglés (`en` en `infografias`, `src/data/contenido.js`).

| Archivo | Versión en español |
|---|---|
| infografia-panel-solar-en.webp | infografia-panel-solar.webp |
| infografia-sistema-hibrido-en.webp | infografia-sistema-hibrido.webp |
| infografia-calentador-presurizado-en.webp | infografia-calentador-presurizado.webp |
| infografia-colector-mariposa-en.webp | infografia-colector-mariposa.webp |

## Videos de monitorización en inglés

Versiones en inglés de los dos videos de la sección "Monitorización en tiempo real" (entregadas por el cliente, 2026-11-10): `monitoreo-escritorio-en.mp4` y `monitoreo-movil-en.mp4` en `public/video/`, recodificadas a H.264 (CRF 23, faststart) y con su póster `-en.webp` (fotograma al segundo 1). Se usan al elegir inglés (`src/components/Monitoreo.jsx`).

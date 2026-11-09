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

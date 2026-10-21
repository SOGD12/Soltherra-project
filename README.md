# Soltherra S.A.S. — Landing page

Sitio web de una sola página de **Soltherra S.A.S.**, empresa colombiana de energía solar con sede en Cali. Su lema es *"Energía Sostenible"*.

## La empresa

Soltherra diseña, instala y mantiene **sistemas solares fotovoltaicos** y **sistemas solares térmicos** para hogares, empresas e instituciones. Acompaña al cliente desde la ingeniería hasta la puesta en marcha, con cumplimiento normativo, ahorro económico y menor impacto ambiental.

**Misión.** Brindar soluciones energéticas sostenibles a través de sistemas solares fotovoltaicos y térmicos, contribuyendo al ahorro económico, al cuidado del medio ambiente y al bienestar de las comunidades, con un servicio confiable, innovador y de alta calidad.

**Visión.** Ser una empresa líder en energías limpias en Colombia, reconocida por su compromiso con la sostenibilidad, la innovación tecnológica y la transformación positiva de los hogares, empresas y comunidades hacia un futuro energético responsable.

### Servicios

**Sistemas solares fotovoltaicos**
- Ingeniería detallada para proyectos solares.
- Trámites de conexión ante el operador de red.
- Trámites para beneficios tributarios.
- Estudio de conexión simplificada para sistemas fotovoltaicos (AGPE y GD).
- Mantenimiento preventivo y correctivo.

**Sistemas solares térmicos**
- Climatización de piscinas con energía solar térmica.
- Calentamiento de aguas sanitarias con sistemas solares térmicos.
- Mantenimiento preventivo y correctivo.

### Beneficios para el cliente
- Reducción significativa en costos de energía.
- Contribución directa al cuidado del medio ambiente.
- Cumplimiento total de normativas técnicas y legales.
- Soluciones personalizadas según cada necesidad.
- Mayor independencia energética y retorno de inversión.

### Contacto

| | |
|---|---|
| Celular / WhatsApp | +57 313 813 0046 |
| Correo | soltherra23@gmail.com |
| Dirección | Calle 28 N° 86 - 70, Cali, Valle del Cauca |
| Instagram | [@soltherra_energiasostenible](https://www.instagram.com/soltherra_energiasostenible/) |
| Facebook | [Soltherra](https://web.facebook.com/profile.php?id=61587216064854) |



## Desarrollo

```bash
npm install
npm run dev
```

Stack: React 19 + Vite, Anime.js 4 (animaciones de scroll), Zdog (escena 3D), Material Symbols (iconos en SVG en línea), fuentes Archivo y Hanken Grotesk locales. El SEO que depende del dominio se activa con `VITE_SITE_URL` (ver `vite.config.js`).

### Estructura

- `src/data/contenido.js`: todos los textos y datos reales (contacto, servicios, pasos, beneficios, menú). `src/data/trabajos.json` alimenta «Nuestros trabajos» (18 obras con `categoria`), leído por `src/api/trabajos.js`.
- `src/components/`: una sección por archivo, en el orden de `App.jsx`: Hero, Cinta, Nosotros, MisionVision, Soluciones, Gestiones, Servicios, Recorrido, Proceso, Franja, Trabajos, Beneficios, Contacto y Pie. `Comunes.jsx` tiene el botón de WhatsApp y la etiqueta en píldora; `Iconos.jsx` los iconos.
- `src/animaciones.js`: animaciones de scroll con Anime.js (titulares palabra a palabra, párrafos que se llenan al leer, paralaje, bloques oscuros que crecen, línea del proceso, franja de la piscina, beneficios). Se carga aparte desde `hooks/useAnimaciones.js`.
- `src/escena.js`: escena 3D con Zdog de la sección «Cómo funciona». El avance del scroll mueve la historia (sol → panel → inversor → casa) y la casa se puede girar arrastrando.
- `hooks/useProgresoScroll.js`: barra de progreso y estado de la cabecera flotante (se encoge y se esconde al bajar).

### Diseño

Página clara con bloques oscuros redondeados, cabecera flotante en píldora con desenfoque, mosaico de soluciones y escenas atadas al scroll. Paleta del logo: marino `#072a41`, verde `#187a41` / `#3bb86a` para acciones y sol `#fdb62e` como acento. Con `prefers-reduced-motion` todo queda quieto y visible.

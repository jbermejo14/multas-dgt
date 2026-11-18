# Ododex · Multas y radares

Web informativa de multas de tráfico, pérdida de puntos del permiso y radares de la DGT en España. Forma parte de la red **Ododex** y se publica en `https://ododex.com/es/multas`.

Desarrollada con Next.js 16 (App Router), React 19, Tailwind CSS 4 y Leaflet con teselas de OpenStreetMap.

> **Aviso legal:** Ododex es un sitio informativo independiente, sin vinculación con la Dirección General de Tráfico (DGT), la Guardia Civil ni el Ministerio del Interior. Los resultados son orientativos y no sustituyen a la notificación de la sanción.

El diseño de módulos y las decisiones están en [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## Qué incluye

1. **Calculadora de multas por velocidad** (`src/lib/speedFine.ts`):
   - Cuadro de sanciones del Anexo IV del RDL 6/2015.
   - Márgenes de error de la Orden ICT/155/2020: 3 km/h o 3 % en radares fijos y de tramo; 5 km/h o 5 % en móviles.
   - Umbral de delito del artículo 379.1 del Código Penal (+60 km/h en vía urbana, +80 km/h en interurbana).
   - Descuento del 50 % por pronto pago (20 días naturales).
2. **Catálogo de infracciones** (`src/data/infractions.ts`): 28 infracciones con enlace a la norma en el BOE y fecha de verificación. Cada una tiene su página en `/multas/<slug>`.
3. **Radares de la DGT** (`src/data/dgt-radars.json`): 737 cinemómetros fijos y de tramo del Punto de Acceso Nacional (NAP) de la DGT.
   - `/radares`: índice por provincias.
   - `/radares/<provincia>` y `/radares/<provincia>/<carretera>`: listado y mapa.
   - `/radares/radar/<id>`: ficha de cada radar. Lleva `noindex, follow` y no está en el sitemap, porque las 737 fichas son casi iguales y Google las trataría como contenido escaso.
   - El mapa de la home muestra los 737 radares con filtros por provincia, carretera y tipo.
4. **Páginas legales**: `/aviso-legal`, `/privacidad` y `/cookies`, con `noindex`.
5. **Publicidad**: Google AdSense con su mensaje de consentimiento (TCF v2.2) y bloques manuales `AdSlot` (1 a 3 por página, nunca en legales ni en la 404), según la sección 8 de `../ododex-sitio/ARCHITECTURE.md`.

---

## Requisitos e instalación

- Node.js 20 o superior (recomendado 22).
- npm.

```bash
npm install --force
```

`--force` hace falta en Windows: el paquete `@tailwindcss/oxide-wasm32-wasi` declara `cpu: wasm32` (ver "Estilos y marca").

---

## Ejecución

```bash
npm run dev
```

```bash
npm run build
```

En desarrollo la web está en `http://localhost:3000/es/multas` (la raíz `/` da 404, porque todo cuelga de la ruta base).

`npm run build` exporta el sitio como ficheros estáticos en `out/` (`output: "export"` en `next.config.ts`). Con exportación estática no existe `npm run start`: para ver el resultado como en producción, usa `npm run preview` en `../ododex-sitio`.

---

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Descripción | Valor por defecto |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Origen del sitio, sin ruta ni barra final. Se usa en canonical, sitemap, migas y Open Graph | `http://localhost:3000` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Identificador de AdSense: `ca-pub-` y 16 dígitos. Vacío o inválido: no se carga AdSense ni se muestra el botón "Configurar cookies" | vacío |

En producción:

```env
NEXT_PUBLIC_SITE_URL=https://ododex.com
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
```

---

## Publicación en ododex.com

- **Ruta base:** `/es/multas` (`BASE_PATH` en `src/lib/site.ts`, aplicado como `basePath` en `next.config.ts`; una prueba comprueba que coinciden). Los enlaces internos van con `next/link`; los `<img>` y los enlaces dentro de HTML de Leaflet pasan por `assetPath()`.
- **`config/titular.json`:** datos del titular (`tipo`, `nombre`, `nif`, `domicilio`, `email` y, si es empresa, `registroMercantil`). No está en git porque contiene datos personales. Se crea copiando `config/titular.example.json` y se rellena en cada máquina donde se compile. Un campo vacío aparece como `[pendiente: campo]` en las páginas legales. Hay que completarlo antes de publicar.
- **AdSense:** con `NEXT_PUBLIC_ADSENSE_CLIENT` válido se carga el script en todas las páginas. En la consola de AdSense hay que:
  - activar los anuncios automáticos para `ododex.com`;
  - crear el mensaje de consentimiento para la UE en "Privacidad y mensajes" (lo sirve el mismo script; no hay otra CMP).
- **Despliegue:** el proyecto hermano `../ododex-sitio` compila esta web con las variables de producción, copia `out/` bajo `/es/multas` junto a las demás secciones y lo sube a Cloudflare Pages. También genera en la raíz de `ododex.com` el `robots.txt` (con `Sitemap: https://ododex.com/es/multas/sitemap.xml`) y el `ads.txt`, que solo valen en la raíz del dominio. Ver su README.
- **Search Console:** dar de alta el dominio `ododex.com` y enviar `https://ododex.com/es/multas/sitemap.xml`.

---

## Estilos y marca

- Marca **Ododex**: `SITE_NAME` y `SECTION_NAME` en `src/lib/site.ts`; logos en `public/brand/` (copias sin modificar de `../brand/`); favicon en `src/app/icon.svg`.
- Mismo sistema visual que la calculadora de impuestos de la red: variables CSS por tema en `src/app/globals.css`, con el atributo `data-theme` de `<html>` guardado en `localStorage['ododex-theme']`. Tailwind las expone como `bg-surface`, `bg-elevated`, `border-line`, `text-fg`, `text-muted`, `text-accent`, `bg-accent-soft`… Las pruebas impiden colores de paleta fijos (`neutral-*`, `#ff6b00`…) y degradados en los componentes, y comprueban el contraste WCAG AA de los tokens.
- Las reglas de Leaflet van en `@layer base` y no fijan alto ni ancho: una regla fuera de capa gana a las utilidades de Tailwind (`h-[400px]`) y dejaba los mapas a 2 px. Los contenedores de mapa llevan `isolate` para que las capas de Leaflet (z-index 400+) no tapen la cabecera fija.
- Tailwind 4 se compila por PostCSS (`postcss.config.mjs`) para que funcione igual con webpack y Turbopack. En Windows con una política que bloquea los binarios nativos (`@next/swc-win32-x64-msvc`, `@tailwindcss/oxide-win32-x64-msvc`) se usa `@tailwindcss/oxide-wasm32-wasi`. Su escáner no lee rutas `C:\`, así que `postcss-tailwind-windows.cjs` extrae las clases de `src/` y las declara con `@source inline()` (solo en `win32`). `npm run build` usa `next build --webpack`.

---

## Pruebas

```bash
npm test
```

Usan el runner nativo de Node con `tsx` (TypeScript y JSX), sin red. Cubren:

- `speed-fine.test.mjs`: los 11 límites, sus tramos, márgenes de radar y umbral penal.
- `legal-infractions.test.mjs`: fuente oficial en HTTPS y verificación de menos de 365 días en cada infracción; casos concretos de la Ley 18/2021.
- `seo-data.test.mjs` y `seo-titles.test.mjs`: sitemap (sin fichas de radar), títulos con la plantilla de marca, slugs sin acentos e integridad del dataset de radares.
- `site.test.ts`: URLs absolutas, ruta base y ausencia de enlaces internos sin ruta base.
- `legal.test.ts` y `legal-pages.test.tsx`: datos del titular, contenido y `noindex` de las páginas legales, script de AdSense y pie.
- `radar-map.test.ts`: filtros, límite para la calculadora, escapado del HTML de los popups y capas de mapa.
- `ui-*.test.ts(x)`: marca, colores fijos prohibidos y contraste de los tokens.

Antes de publicar, además:

```bash
npx tsc --noEmit
```

```bash
npm run lint
```

---

## Actualización de datos

### Normativa y sanciones

1. Consulta la versión consolidada del RDL 6/2015 en el BOE: [BOE-A-2015-11722](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11722).
2. Edita `src/data/infractions.ts`: importes y puntos que hayan cambiado, y `fechaVerificacion` con la fecha de la revisión (`YYYY-MM-DD`).
3. Ejecuta `npm test`. La prueba falla si alguna infracción lleva más de 365 días sin verificar.

### Radares de la DGT

1. Descarga el XML de ubicaciones del NAP de la DGT:
   ```bash
   curl -o scripts/sample.xml "https://nap.dgt.es/datex2/dgt/PredefinedLocationsPublication/radares/content.xml"
   ```
2. Regenera el dataset:
   ```bash
   node scripts/build-radars-dataset.mjs
   ```
3. Ejecuta `npm test` y `npm run build`.

---

## Estructura

```
src/
  app/            Páginas (home, multas, radares, legales, 404, sitemap)
  components/     Cabecera, pie, calculadora, catálogo, mapas, migas, AdSense
  data/           Infracciones, cuadro de sanciones y radares del NAP
  lib/            Lógica pura: sanciones, radares, filtros de mapa, sitio y legal
config/           Datos del titular (titular.json fuera de git)
public/brand/     Logos de Ododex
scripts/          Extracción del dataset de radares
test/             Pruebas sin red
```

# Arquitectura: Ododex · Multas y radares

## 1. Objetivo y alcance

Web informativa de multas de tráfico, pérdida de puntos y radares de la DGT en España. Forma parte de la red **Ododex** (`ododex.com`) y se publica bajo la ruta `/es/multas`, igual que la calculadora de impuestos se publica bajo `/es/impuestos`.

Este documento cubre la migración desde la marca anterior ("RadarPuntos") y la puesta a punto para producción:

- Marca Ododex y estilo visual de `../calculadora-impuestos` (tokens, cabecera, pie, tarjetas).
- Ruta base `/es/multas`.
- Páginas legales, AdSense con su mensaje de consentimiento.
- Corrección del mapa de radares que no se veía.
- SEO: cabecera y pie en todas las páginas, 404 en español, fichas de radar con `noindex`.
- Mapa de la home con los datos reales de la DGT en lugar de los 48 radares escritos a mano.

Fuera de alcance:

- Cambiar la lógica de cálculo (`src/lib/speedFine.ts`) o los datos legales (`src/data/infractions.ts`).
- Imagen Open Graph (pendiente del sistema de diseño común, prompt 17).
- Analítica.
- Bloques de anuncio colocados a mano: se usan los anuncios automáticos de AdSense.

### Referencia

`../calculadora-impuestos` es la referencia de estilo y de estructura. Cuando este documento diga "como en la calculadora", hay que leer el fichero indicado allí y replicarlo, cambiando solo lo que se diga aquí. No se modifica nada de `../calculadora-impuestos`.

### Decisiones tomadas con el titular

- Ruta base: `/es/multas`.
- Fichas individuales de radar (`/radares/radar/[id]`): `noindex, follow` y fuera del sitemap.
- Mapa de la home: los 737 radares del NAP de la DGT (`src/data/dgt-radars.json`). Se elimina el ranking de "radares que más multan" y sus cifras, porque no tienen fuente.

## 2. Módulos

### 2.1 Sitio y ruta base (`src/lib/site.ts`, `next.config.ts`)

Responsabilidad: nombre de la marca, ruta base y construcción de URLs absolutas.

Copia de `../calculadora-impuestos/lib/site.ts` con estos valores:

```ts
export const SITE_NAME = 'Ododex';
export const SECTION_NAME = 'Multas y radares';
export const BASE_PATH = '/es/multas';
export function getSiteUrl(): string;          // NEXT_PUBLIC_SITE_URL sin barra final; por defecto http://localhost:3000
export function absoluteUrl(path: string): string; // origen + BASE_PATH + ruta; absoluteUrl('/') → 'https://ododex.com/es/multas'
export function assetPath(path: string): string;   // BASE_PATH + ruta, para <img>, <a> sin next/link y scripts
```

- `next.config.ts`: añade `basePath: '/es/multas'` (constante duplicada con el comentario de la calculadora) y conserva `cacheComponents` y `partialPrefetching`.
- `src/lib/siteConfig.ts` deja de usarse: todo `getCanonicalUrl(x)` pasa a `absoluteUrl(x)` y todo `getSiteUrl()` importado de allí pasa a `@/lib/site`. La sesión principal borra el fichero después.
- `.env.example`: `NEXT_PUBLIC_SITE_URL=https://ododex.com` (solo el origen) y `NEXT_PUBLIC_ADSENSE_CLIENT=` vacía, con comentarios en español.
- `src/app/robots.ts` deja de usarse (robots.txt solo vale en la raíz del dominio). La sesión principal lo borra.
- Ningún `<img src>` ni `<a href>` sin `next/link` apunta a una ruta interna sin `assetPath`.

Criterio de aceptación: `test/site.test.ts` cubre `absoluteUrl` (raíz, ruta con y sin barra inicial, origen con barra final), `assetPath` y que `next.config.ts` contiene el mismo `BASE_PATH`.

### 2.2 Legal y consentimiento (`src/lib/legal.ts`, páginas legales, AdSense)

Responsabilidad: datos del titular y textos legales; carga del script de AdSense.

Copiar de la calculadora, adaptando rutas de importación y textos:

| Calculadora | Aquí |
|---|---|
| `lib/legal.ts` | `src/lib/legal.ts` (misma interfaz pública, ver sección 2.10 de `../calculadora-impuestos/ARCHITECTURE.md`) |
| `app/aviso-legal/page.tsx` | `src/app/aviso-legal/page.tsx` |
| `app/privacidad/page.tsx` | `src/app/privacidad/page.tsx` |
| `app/cookies/page.tsx` | `src/app/cookies/page.tsx` |
| `components/AdSenseScript.tsx` | `src/components/AdSenseScript.tsx` |
| `components/ConsentSettingsButton.tsx` | `src/components/ConsentSettingsButton.tsx` |
| `components/Breadcrumbs.tsx` | `src/components/Breadcrumbs.tsx` |

- `config/titular.example.json` y `config/titular.json` ya existen (el segundo fuera de git). No se modifican.
- Cambios de texto en las páginas legales: el objeto del sitio es "información orientativa sobre multas de tráfico, puntos del permiso y ubicación de radares"; el sitio no es oficial de la DGT, la Guardia Civil ni el Ministerio del Interior; el resultado de la calculadora no sustituye a la notificación de la sanción. La tabla de cookies conserva `ododex-theme` y AdSense; añade los teselas de OpenStreetMap (el navegador pide imágenes a `tile.openstreetmap.org`, que recibe la IP; no instala cookies) en la sección de privacidad como tercero.
- Las tres páginas: `robots: { index: false, follow: true }`, fuera del sitemap.
- `src/components/AdPlaceholder.tsx` deja de usarse en todas las páginas. Los anuncios serán automáticos (AdSense Auto ads), configurados por el titular en AdSense. La sesión principal borra el fichero.

Criterio de aceptación: `test/legal.test.ts` y `test/legal-pages.test.tsx` equivalentes a los de la calculadora (`../calculadora-impuestos/tests/legal.test.ts`, `legal-pages.test.tsx`), más la prueba de `AdSenseScript` (no renderiza sin variable o con valor inválido; renderiza el script con un `ca-pub-` de 16 dígitos).

### 2.3 Marca, tokens y estructura común (`src/app/layout.tsx`, `src/app/globals.css`, `Header`, `Footer`, `BrandLogo`, `not-found`)

Responsabilidad: identidad Ododex y cascarón común de todas las páginas.

- `public/brand/` (logos) y `src/app/icon.svg` (favicon) ya están copiados.
- `src/components/BrandLogo.tsx`: copia de la calculadora.
- `src/app/globals.css`:
  - Tokens, `@theme inline` y clases base copiados de `../calculadora-impuestos/app/globals.css`: variables de los dos temas, `body`, `:focus-visible`, `.site-header` y relacionadas, `.theme-toggle-btn` y relacionadas, `.main-wrapper`, `.card` y relacionadas, `.btn` y variantes, `.site-footer` y relacionadas, `.legal-text`, `.breadcrumbs`, `.link-card` y relacionadas, `.tag` y variantes, y sus `@media`. Solo lo que se use.
  - El tema se controla con `data-theme` en `<html>`. Se sustituye `@custom-variant dark (&:where(.dark, .dark *))` por `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));` para que cualquier `dark:` que quede funcione.
  - **Corrección del mapa:** las reglas de Leaflet (`.leaflet-container`, popups) van dentro de `@layer base` y `.leaflet-container` no fija `width` ni `height`. Hoy `.leaflet-container { height: 100% }` está fuera de capa y gana a la utilidad `h-[400px]`, que está en la capa `utilities`: el mapa mide 2 px. Los colores de los popups usan los tokens.
  - Se conserva `.animate-radar-pulse` si se sigue usando.
- `src/app/layout.tsx`, como el de la calculadora:
  - Fuentes Inter (400, 500, 600, 700) y JetBrains Mono (500, 700) con `next/font/google`, en lugar de Geist.
  - Script de tema con `localStorage['ododex-theme']` y `data-theme`.
  - `<Header />`, `{children}`, `<Footer mostrarConsentimiento={getAdSenseClient() !== null} />` y `<AdSenseScript />` en el `body`. Las páginas dejan de importar `Navbar` y `Footer`.
  - Metadatos: `template: '%s | Ododex'`, `siteName`, `authors`, `creator` y `publisher` con `SITE_NAME`. Título por defecto: "Multas de tráfico, puntos y radares DGT". Sin `keywords` de relleno nuevos; se pueden conservar los actuales.
- `src/components/Header.tsx`: como el de la calculadora (logo, separador, `SECTION_NAME`, conmutador de tema) más una segunda fila `<nav aria-label="Secciones">` con cuatro enlaces `next/link`: "Calculadora" (`/#calculadora`), "Infracciones" (`/#infracciones`), "Radares" (`/radares`), "Preguntas" (`/#faq`). En 375 px caben en una fila sin desbordar la página. Sustituye a `Navbar.tsx` y `ThemeToggle.tsx`, que la sesión principal borra.
- `src/components/Footer.tsx`: estructura de la calculadora. Contenido:
  - "**Ododex** • Multas, puntos y radares de tráfico en España."
  - Aviso: sitio independiente, no oficial de la DGT; cálculos según el Anexo IV del RDL 6/2015 y la Orden ICT/155/2020; radares del Punto de Acceso Nacional de la DGT.
  - Fila legal: Aviso legal · Privacidad · Cookies · botón de consentimiento si procede.
  - "Radares por provincia": enlace a cada provincia (`getAllProvinces()`), como los enlaces de comunidades de la calculadora.
  - "Infracciones frecuentes": los cuatro enlaces a `/multas/...` que ya existen.
  - Enlaces externos actuales (sede DGT, pago de multas, BOE) con `rel="noopener noreferrer"` y `target="_blank"`.
  - Todos los enlaces internos con `next/link`; los anclas de la home como `/#calculadora`.
- `src/app/not-found.tsx`: página 404 en español con el estilo `card`, enlace a la home y a `/radares`. Sin metadatos `robots` propios (Next añade `noindex`; no debe haber otro `robots` con `index`).

Criterio de aceptación:

- `test/ui-brand-and-colors.test.ts`: ningún fichero de `src/` contiene "RadarPuntos" ni "radarpuntos"; `SITE_NAME` es "Ododex".
- `test/ui-contrast.test.ts`: copia de la de la calculadora, apuntando a `src/app/globals.css`.
- `test/seo-titles.test.mjs` adaptado a la marca "Ododex".

### 2.4 Mapa de la home con datos DGT (`src/components/RadarMap.tsx`)

Responsabilidad: mapa interactivo de la home con los radares del NAP.

- Lee `getAllRadars()` de `src/lib/radarsData.ts` (tipo `DgtRadar`) en lugar de `RADARS_DATA` de `src/data/radars.ts`.
- Se eliminan el ranking "top multas", `multasAnualesAprox`, `esTopMultas`, `rankingMasMultas` y todo texto que dependa de ellos.
- Filtros que se conservan si existen: por provincia y por tipo (Fijo / Tramo). El límite de velocidad que se pasa a la calculadora sale de `velocidadEstimada`; si es `null` o no es un `RoadSpeedLimit` válido, no se ofrece el botón "calcular con este límite".
- Cada marcador enlaza a su ficha `/radares/radar/[id]` (con `next/link` o, dentro del HTML del popup de Leaflet, con `assetPath`).
- `src/data/radars.ts` y el tipo `RadarData` de `src/types/index.ts` dejan de usarse. La sesión principal borra el fichero de datos; el implementador quita el tipo si nadie más lo usa.

Criterio de aceptación: ningún fichero de `src/` importa `@/data/radars`; `npm run build` pasa; en pantalla, la home muestra marcadores de toda España.

### 2.5 SEO de las páginas (`src/app/**/page.tsx`, `src/app/sitemap.ts`, `src/components/JsonLd.tsx`)

Responsabilidad: metadatos, migas y sitemap coherentes con la ruta base y las decisiones de 1.

- `/radares/radar/[id]`: `robots: { index: false, follow: true }` en `generateMetadata`.
- `sitemap.ts`: quita las fichas de radar. Mantiene home, `/radares`, provincias, carreteras e infracciones, todas con `absoluteUrl`.
- Migas JSON-LD de `/multas/[slug]`: el segundo elemento apunta a `absoluteUrl('/')` con nombre "Infracciones", no a una URL con `#`.
- Títulos de `/multas/[slug]`: `Multa por ${minúscula inicial del título}: ${importe} € y ${puntos} puntos` (sin puntos: `${importe} €, sin pérdida de puntos`). La marca la añade la plantilla.
- Títulos de la home: absoluto "Calculadora de multas de tráfico, puntos y radares DGT | Ododex".
- Canonical de la home: `absoluteUrl('/')`.

Criterio de aceptación: `test/seo-data.test.mjs` actualizado: dominio por defecto vía `getSiteUrl()` de `@/lib/site`, el sitemap no contiene `/radares/radar/` y sí el resto; los títulos de multas empiezan por "Multa por " seguida de minúscula.

### 2.6 Estilo de todas las páginas y componentes

Responsabilidad: que todo use los tokens de 2.3 y se vea como la calculadora.

Ficheros: `src/components/{HomePageView,SpeedCalculator,InfractionsDirectory,RadarMap,DgtRadarsMap,FaqSection}.tsx` y `src/app/**/page.tsx`.

- Colores fijos fuera: `neutral-*`, `zinc-*`, `slate-*`, `gray-*`, `orange-*`, `[#ff6b00]`, `[#e05e00]`, `[#0D0D0D]`, `[#141414]`, `[#121212]` y similares pasan a los semánticos: `bg-bg`, `bg-surface`, `bg-elevated`, `border-line`, `text-fg`, `text-muted`, `text-accent`, `bg-accent-soft`, o a las clases `card`, `btn`, `tag`, `link-card`, `breadcrumbs`. Texto blanco sobre fondo de acento: `var(--on-accent-bg)` como en la calculadora.
- Colores de estado (verde, ámbar, rojo para gravedad o delito) se permiten solo como `tag-green`, `tag-red` o variables `--positive` / `--negative`; si hace falta ámbar, se añade una pareja `--warning` / `--warning-bg` con contraste ≥ 4,5:1 en los dos temas y su prueba de contraste.
- Sin degradados, brillos ni sombras de color en titulares (como la calculadora).
- Breadcrumbs visibles con el componente `Breadcrumbs`.
- Los contenedores de mapa conservan su altura (`h-[400px]`, etc.) y se ven.
- `npm run lint` termina sin errores (los avisos se permiten). Incluye quitar los `any` de los componentes de mapa con tipos de `leaflet` y resolver `react-hooks/set-state-in-effect`. Si hace falta, `eslint.config.mjs` ignora `scripts/`.

Criterio de aceptación:

- Prueba `test/ui-colors.test.ts`: ningún `.tsx` de `src/` contiene `neutral-`, `zinc-`, `slate-`, `gray-`, `text-orange-`, `bg-orange-` ni `#ff6b00`.
- `npm test`, `npx tsc --noEmit`, `npm run lint` (sin errores) y `npm run build` pasan.

## 3. Orden de implementación

1. **Plataforma** (2.1, 2.2, 2.3, 2.5): ruta base, legales, marca, cascarón común y SEO. Sin dependencias.
2. **Mapa de la home** (2.4): depende de 1 (`assetPath`).
3. **Estilo** (2.6): depende de 1 y 2 (se reestiliza el código ya definitivo).

Tras cada módulo, la sesión principal borra los ficheros que han quedado sin uso (`git rm`) y hace commit.

## 4. Verificación en pantalla (sesión principal)

- `/es/multas`, una infracción, `/radares`, una provincia, una carretera y una ficha de radar cargan con cabecera y pie.
- Los mapas se ven (altura > 300 px) en provincia, carretera, ficha y home.
- 375 y 1280 px, tema claro y oscuro, sin desbordamiento horizontal.
- La ficha de radar lleva `noindex`; el sitemap no la contiene.
- La 404 está en español y tiene un solo `robots` (`noindex`).

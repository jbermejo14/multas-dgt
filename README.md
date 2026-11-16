# RadarPuntos (`radarpuntos.es`)

Consultor ciudadano independiente de multas de tráfico, cálculo de pérdida de puntos, márgenes de cinemómetros y mapa de radares de la DGT en España. Desarrollado con Next.js (App Router), React, Tailwind CSS y OpenStreetMap / Leaflet.

> **Aviso Legal:** RadarPuntos es un proyecto divulgativo e informativo independiente, sin vinculación institucional ni relación contractual con la Dirección General de Tráfico (DGT), el Ministerio del Interior ni ningún otro organismo público.

---

## 🚀 Características Principales

1. **Calculadora de Exceso de Velocidad:**
   - Implementada en un módulo puro (`src/lib/speedFine.ts`) según el **Anexo IV del RDL 6/2015** (Ley de Tráfico).
   - Aplica los márgenes de error metrológicos oficiales fijados en la **Orden ICT/155/2020** (3 km/h o 3% para radares fijos/tramo; 5 km/h o 5% para móviles).
   - Detección automática del umbral penal según el **Artículo 379.1 del Código Penal** (+60 km/h en vía urbana, +80 km/h en interurbana).
   - Cálculo del descuento del 50% por pronto pago (20 días naturales).

2. **Catálogo de Infracciones Verificables con el BOE:**
   - 28 infracciones comunes de la Ley de Tráfico y Seguridad Vial.
   - Cada infracción incluye enlace directo a la norma oficial en el BOE y campo `fechaVerificacion`.
   - Páginas dedicadas en `/multas/[slug]` con metadatos OpenGraph, datos estructurados `BreadcrumbList` y `FAQPage` JSON-LD.

3. **SEO Programático de Radares DGT:**
   - Dataset de 737 cinemómetros (fijos y de tramo) obtenido del canal DATEX II del **Punto de Acceso Nacional (NAP) de la DGT**.
   - Navegación multinivel con slugs normalizados y libres de acentos:
     - `/radares`: Directorio nacional por provincias.
     - `/radares/[provincia]`: 43 páginas provinciales con mapa OpenStreetMap y desglose de vías.
     - `/radares/[provincia]/[carretera]`: Más de 360 páginas por carretera/autovía con puntos kilométricos (PK) y sentido.
     - `/radares/radar/[id]`: Fichas técnicas individuales con coordenadas, singularidad de vía y cálculo rápido de sanción.
   - Páginas inexistentes devuelven código de estado HTTP 404 real (`notFound()`).

4. **SEO Técnico y Publicidad Limpia:**
   - Sin etiquetas canonical fijas ni erróneas: cada página define su canonical absoluto mediante `NEXT_PUBLIC_SITE_URL`.
   - `sitemap.xml` dinámico (`src/app/sitemap.ts`) que indexa más de 1.170 URLs.
   - `robots.txt` dinámico (`src/app/robots.ts`).
   - Componente `AdPlaceholder` inteligente: en entorno de producción no ocupa espacio en blanco si no se ha configurado `NEXT_PUBLIC_ADSENSE_CLIENT`.

---

## 🛠️ Requisitos e Instalación

- **Node.js**: v20.x o superior (recomendado Node.js 22+).
- **Gestor de paquetes**: `npm` (incluido con Node).

```bash
# Clonar o situarse en el directorio del proyecto
cd multas-dgt

# Instalar dependencias
npm install
```

---

## ⚙️ Variables de Entorno

Copia el archivo de ejemplo para configurar tus variables locales:

```bash
cp .env.example .env.local
```

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | URL base canónica del sitio (sin barra final) | `https://radarpuntos.es` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Identificador de editor de Google AdSense | Vacío (los anuncios no se renderizan) |

---

## 💻 Ejecución

```bash
# Modo desarrollo con recarga en caliente
npm run dev

# Compilación para producción
npm run build

# Iniciar servidor compilado en producción
npm run start
```

---


### Tailwind CSS y PostCSS

Tailwind 4 se integra por PostCSS (`postcss.config.mjs`, plugin `@tailwindcss/postcss`), de modo que funciona igual con webpack (`npm run build` usa `next build --webpack`) y con Turbopack (despliegue en Linux). No hay regla `turbopack` en `next.config.ts`: Turbopack lee el `postcss.config.mjs` de la raíz.

En Windows con una política de Control de Aplicaciones que bloquea los binarios nativos (`@next/swc-win32-x64-msvc` y `@tailwindcss/oxide-win32-x64-msvc`) se usa la variante WASM `@tailwindcss/oxide-wasm32-wasi` (4.3.3, en `optionalDependencies`). Su escáner no puede leer rutas de Windows desde WASI y no detecta ninguna clase, así que el plugin `postcss-tailwind-windows.cjs` extrae las clases de `src/` y las declara con `@source inline()`, solo cuando `process.platform === "win32"`. En Linux se usa el binario nativo y el escáner normal. Para instalar la variante WASM en Windows hace falta `npm install --force` (el paquete declara `cpu: wasm32`).

## 🧪 Pruebas Automatizadas (Offline)

El proyecto cuenta con una suite completa de pruebas unitarias y de integración que se ejecutan sin conexión de red mediante el test runner nativo de Node.js:

```bash
npm test
```

### Qué verifican las pruebas:
1. `test/legal-infractions.test.mjs`:
   - Todas las infracciones tienen enlace oficial a `https://www.boe.es/` o sede DGT.
   - Ninguna infracción tiene una `fechaVerificacion` con más de 365 días de antigüedad.
   - La detracción de puntos coincide con la reforma de la Ley 18/2021 (p. ej. auriculares = 0 puntos).
   - Infracciones no sujetas a pronto pago (inhibidores, no identificar conductor) están bien marcadas.
2. `test/speed-fine.test.mjs`:
   - Comprueba los 11 límites de velocidad oficiales (20 a 120 km/h) y sus 5 tramos sancionadores.
   - Comprueba la aplicación de márgenes de error de radar fijo (-3 km/h / -3%) y móvil (-5 km/h / -5%).
   - Comprueba el umbral de delito contra la seguridad vial del Código Penal (Art. 379.1).
3. `test/seo-data.test.mjs`:
   - Dominio base canónico y estructura de URLs.
   - Integridad de los 737 cinemómetros publicados por la DGT.
   - Slugs estables sin acentos para provincias y carreteras.
   - Generación de sitemap con cobertura de más de 1.100 páginas.

---

## 🔄 Actualización de Datos

### 1. Actualización de Normativa y Sanciones Legales
1. Accede a la versión consolidada del **Real Decreto Legislativo 6/2015** en el BOE: [BOE-A-2015-11722](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11722).
2. Edita `src/data/infractions.ts`.
3. Para cada infracción revisada, actualiza los importes o puntos si hubo modificaciones legislativas.
4. Establece la fecha actual en formato ISO (`YYYY-MM-DD`) en el campo `fechaVerificacion`.
5. Ejecuta `npm test` para asegurar que las validaciones legales siguen pasando.

### 2. Actualización del Catálogo de Radares DGT
1. Descarga el feed XML de ubicaciones predefinidas del Punto de Acceso Nacional (NAP DGT):
   ```bash
   curl -o scripts/sample.xml "https://nap.dgt.es/datex2/dgt/PredefinedLocationsPublication/radares/content.xml"
   ```
2. Ejecuta el script de normalización y extracción:
   ```bash
   node scripts/build-radars-dataset.mjs
   ```
3. El script regenera automáticamente `src/data/dgt-radars.json` con los nuevos cinemómetros, puntos kilométricos y coordenadas normalizadas.
4. Ejecuta `npm test` y `npm run build` para comprobar que las rutas programáticas y el sitemap se regeneran sin errores.

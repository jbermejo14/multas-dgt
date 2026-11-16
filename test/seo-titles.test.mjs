import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const BRAND = "RadarPuntos";
const LAYOUT_PATH = "src/app/layout.tsx";
const PAGE_PATHS = [
  "src/app/page.tsx",
  "src/app/multas/[slug]/page.tsx",
  "src/app/radares/page.tsx",
  "src/app/radares/[provincia]/page.tsx",
  "src/app/radares/[provincia]/[carretera]/page.tsx",
  "src/app/radares/radar/[id]/page.tsx",
];

/** Líneas `title:` de primer nivel (no las de openGraph/twitter, que no usan la plantilla). */
function topLevelTitleLines(source) {
  const lines = source.split(/\r?\n/);
  const result = [];
  let socialBlockDepth = 0;
  for (const line of lines) {
    if (/^\s*(openGraph|twitter):\s*\{/.test(line)) socialBlockDepth = 1;
    else if (socialBlockDepth > 0 && /^\s*\},?\s*$/.test(line)) socialBlockDepth = 0;
    else if (socialBlockDepth === 0 && /^\s*(title|absolute):/.test(line)) result.push(line);
  }
  return result;
}

describe("Títulos: el nombre del sitio aparece una sola vez", () => {
  const layout = fs.readFileSync(LAYOUT_PATH, "utf-8");

  test("El layout aplica la plantilla con la marca", () => {
    assert.match(layout, new RegExp(`template: "%s \| ${BRAND}"`));
  });

  for (const pagePath of PAGE_PATHS) {
    test(`${pagePath} no repite la marca dentro de la plantilla`, () => {
      const source = fs.readFileSync(pagePath, "utf-8");
      const isHome = pagePath === "src/app/page.tsx";
      for (const line of topLevelTitleLines(source)) {
        const usesAbsolute = line.includes("absolute:");
        if (isHome) {
          assert.ok(usesAbsolute || !line.includes(BRAND), `Home debe usar title.absolute: ${line}`);
        } else {
          assert.ok(!line.includes(BRAND), `Título duplicaría la marca con la plantilla: ${line}`);
        }
      }
    });
  }

  test("La home usa title.absolute para no recibir la plantilla", () => {
    const source = fs.readFileSync("src/app/page.tsx", "utf-8");
    assert.match(source, /absolute:\s*"RadarPuntos/);
  });
});

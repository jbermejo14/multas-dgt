import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

// Read infractions directly from TS file or export
const infractionsRaw = fs.readFileSync("src/data/infractions.ts", "utf-8");

// Parse objects roughly or inspect data
// Better: load via tsx or dynamic compile, or parse exported array
describe("Verificación Legal de Infracciones (RDL 6/2015 y Ley 18/2021)", () => {
  // Extract all infraction blocks
  const slugRegex = /slug:\s*"([^"]+)"/g;
  const slugs = [...infractionsRaw.matchAll(slugRegex)].map((m) => m[1]);

  test("Existen al menos 25 infracciones documentadas", () => {
    assert.ok(slugs.length >= 25, `Se esperaban >= 25 infracciones, encontradas: ${slugs.length}`);
  });

  test("Todos los slugs son únicos, en minúsculas y sin acentos ni caracteres especiales", () => {
    const set = new Set();
    for (const slug of slugs) {
      assert.ok(!set.has(slug), `Slug duplicado encontrado: ${slug}`);
      set.add(slug);
      assert.match(slug, /^[a-z0-9-]+$/, `Slug no válido: ${slug}`);
    }
  });

  test("Cada infracción dispone de fuente oficial (BOE o DGT) con HTTPS", () => {
    // Find all blocks { ... }
    const blocks = infractionsRaw.split(/id:\s*"/).slice(1);
    for (const block of blocks) {
      const slugMatch = block.match(/slug:\s*"([^"]+)"/);
      const slug = slugMatch ? slugMatch[1] : "desconocido";

      const fuenteMatch = block.match(/fuente:\s*"([^"]+)"/);
      assert.ok(fuenteMatch, `La infracción ${slug} no tiene el campo 'fuente'`);
      const fuente = fuenteMatch[1];
      assert.ok(
        fuente.startsWith("https://www.boe.es/") || fuente.startsWith("https://sede.dgt.gob.es/"),
        `La infracción ${slug} no tiene una fuente oficial válida de BOE o DGT: ${fuente}`
      );
    }
  });

  test("Cada infracción tiene fechaVerificacion y tiene MENOS de 365 días", () => {
    const blocks = infractionsRaw.split(/id:\s*"/).slice(1);
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    for (const block of blocks) {
      const slugMatch = block.match(/slug:\s*"([^"]+)"/);
      const slug = slugMatch ? slugMatch[1] : "desconocido";

      const dateMatch = block.match(/fechaVerificacion:\s*"([^"]+)"/);
      assert.ok(dateMatch, `La infracción ${slug} no tiene 'fechaVerificacion'`);
      const dateStr = dateMatch[1];
      assert.match(dateStr, /^\d{4}-\d{2}-\d{2}$/, `Formato de fecha inválido en ${slug}: ${dateStr}`);

      const verifyDate = new Date(dateStr);
      assert.ok(!isNaN(verifyDate.getTime()), `Fecha no parseable en ${slug}: ${dateStr}`);
      assert.ok(
        verifyDate >= oneYearAgo,
        `La verificación de ${slug} tiene más de 365 días (${dateStr})`
      );
    }
  });

  test("Verificación específica: Conducir con auriculares resta 0 puntos (Ley 18/2021 Anexo II)", () => {
    const auricularesBlock = infractionsRaw
      .split(/id:\s*"/)
      .find((b) => b.includes('slug: "conducir-con-auriculares-o-cascos"'));
    assert.ok(auricularesBlock, "Bloque de auriculares no encontrado");

    const puntosMatch = auricularesBlock.match(/puntos:\s*(\d+)/);
    assert.ok(puntosMatch, "Campo puntos no encontrado");
    assert.equal(
      parseInt(puntosMatch[1], 10),
      0,
      "Conducir con auriculares debe restar 0 puntos según la Ley 18/2021"
    );
  });

  test("Verificación específica: Inhibidor de radar no permite pronto pago y multa 6.000€ (Art. 93.2 LSV)", () => {
    const inhibidorBlock = infractionsRaw
      .split(/id:\s*"/)
      .find((b) => b.includes('slug: "utilizar-inhibidor-de-radares"'));
    assert.ok(inhibidorBlock, "Bloque de inhibidor no encontrado");

    const importeMatch = inhibidorBlock.match(/importe:\s*(\d+)/);
    assert.equal(parseInt(importeMatch[1], 10), 6000);

    const prontoPagoMatch = inhibidorBlock.match(/permiteProntoPago:\s*(true|false)/);
    assert.equal(prontoPagoMatch[1], "false");
  });
});

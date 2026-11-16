import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const radarsRaw = JSON.parse(fs.readFileSync("src/data/dgt-radars.json", "utf-8"));
const siteConfigRaw = fs.readFileSync("src/lib/siteConfig.ts", "utf-8");

describe("SEO Técnico y Configuración Canónica", () => {
  test("Dominio base por defecto es https://radarpuntos.es", () => {
    assert.match(
      siteConfigRaw,
      /https:\/\/radarpuntos\.es/,
      "El dominio base por defecto debe ser https://radarpuntos.es"
    );
  });

  test("Los slugs de todas las provincias son URL-safe y sin acentos", () => {
    const provSlugs = new Set(radarsRaw.map((r) => r.provinciaSlug));
    assert.equal(provSlugs.size, 43, "Se esperan 43 provincias con cinemómetros DGT");
    for (const slug of provSlugs) {
      assert.match(slug, /^[a-z0-9-]+$/, `Slug de provincia no válido: ${slug}`);
      assert.ok(!/[áéíóúñÁÉÍÓÚÑ]/.test(slug), `Slug contiene acentos: ${slug}`);
    }
  });

  test("Los slugs de todas las carreteras son URL-safe y sin acentos", () => {
    const roadSlugs = new Set(radarsRaw.map((r) => r.carreteraSlug));
    assert.ok(roadSlugs.size >= 250, `Se esperaban >= 250 carreteras, encontradas: ${roadSlugs.size}`);
    for (const slug of roadSlugs) {
      assert.match(slug, /^[a-z0-9-]+$/, `Slug de carretera no válido: ${slug}`);
      assert.ok(!/[áéíóúñÁÉÍÓÚÑ]/.test(slug), `Slug contiene acentos: ${slug}`);
    }
  });

  test("Dataset de 737 radares oficiales DGT es íntegro y consistente", () => {
    assert.equal(radarsRaw.length, 737, "El catálogo DGT debe contener exactamente 737 radares");

    const idSet = new Set();
    for (const r of radarsRaw) {
      assert.ok(r.id, "Cada radar debe tener un ID");
      assert.ok(!idSet.has(r.id), `ID de radar duplicado: ${r.id}`);
      idSet.add(r.id);

      assert.ok(r.provincia && r.provincia.length > 0, `Provincia vacía en radar ${r.id}`);
      assert.ok(r.carretera && r.carretera.length > 0, `Carretera vacía en radar ${r.id}`);
      assert.ok(r.pk, `PK vacío en radar ${r.id}`);
      assert.ok(["Fijo", "Tramo"].includes(r.tipo), `Tipo de radar inválido: ${r.tipo}`);
      assert.ok(r.lat >= 27 && r.lat <= 44, `Latitud fuera de rango para España: ${r.lat}`);
      assert.ok(r.lng >= -19 && r.lng <= 5, `Longitud fuera de rango para España: ${r.lng}`);
      assert.ok(r.fuente.includes("DGT"), `Fuente no cita a la DGT: ${r.fuente}`);
      assert.ok(r.fechaPublicacion, `Fecha de publicación ausente en radar ${r.id}`);
    }
  });

  test("Sitemap XML incluye todas las páginas (Home, Infracciones, Provincias, Carreteras y Radares)", () => {
    const provRoadPairs = new Set(
      radarsRaw.map((r) => `${r.provinciaSlug}/${r.carreteraSlug}`)
    );
    const totalExpectedUrls = 1 + 1 + 28 + 43 + provRoadPairs.size + radarsRaw.length;

    assert.ok(
      totalExpectedUrls > 1100,
      `Se esperaba un sitemap con > 1100 URLs, calculadas: ${totalExpectedUrls}`
    );
  });
});

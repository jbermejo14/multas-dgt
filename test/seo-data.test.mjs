import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { getSiteUrl, absoluteUrl } from "@/lib/site";
import sitemap from "@/app/sitemap";
import { generateMetadata as generateInfractionMetadata } from "@/app/multas/[slug]/page";
import { INFRACTIONS_DATA } from "@/data/infractions";

const radarsRaw = JSON.parse(fs.readFileSync("src/data/dgt-radars.json", "utf-8"));

describe("SEO Técnico y Configuración Canónica", () => {
  test("Dominio base por defecto es http://localhost:3000 sin variable de entorno", () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    try {
      assert.equal(getSiteUrl(), "http://localhost:3000");
    } finally {
      if (previous !== undefined) process.env.NEXT_PUBLIC_SITE_URL = previous;
    }
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

  test("Sitemap incluye home, radares, provincias, carreteras e infracciones, y no las fichas de radar", () => {
    const urls = sitemap().map((entry) => entry.url);
    const provRoadPairs = new Set(radarsRaw.map((r) => `${r.provinciaSlug}/${r.carreteraSlug}`));
    const expectedUrls = 2 + INFRACTIONS_DATA.length + 43 + provRoadPairs.size;

    assert.equal(urls.length, expectedUrls);
    assert.ok(urls.includes(absoluteUrl("/")));
    assert.ok(urls.includes(absoluteUrl("/radares")));
    assert.ok(urls.every((url) => !url.includes("/radares/radar/")), "El sitemap no debe contener fichas de radar");
    assert.ok(urls.every((url) => !/\/(aviso-legal|privacidad|cookies)$/.test(url)), "El sitemap no debe contener páginas legales");
  });

  test("Los títulos de multas empiezan por 'Multa por ' seguido de minúscula", async () => {
    for (const infraction of INFRACTIONS_DATA) {
      const metadata = await generateInfractionMetadata({ params: Promise.resolve({ slug: infraction.slug }) });
      assert.match(metadata.title, /^Multa por [a-záéíóúñ]/, `Título inválido: ${metadata.title}`);
      assert.ok(metadata.title.includes(`${infraction.importe} €`), `Falta el importe: ${metadata.title}`);
    }
  });

  // La página importa el mapa (CSS de Leaflet), que Node no carga: se comprueba el código fuente.
  test("Las fichas de radar llevan noindex, follow", () => {
    const source = fs.readFileSync("src/app/radares/radar/[id]/page.tsx", "utf-8");
    assert.match(source, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/);
  });

  test("La home tiene como canonical absoluteUrl('/')", () => {
    const source = fs.readFileSync("src/app/page.tsx", "utf-8");
    assert.match(source, /canonical:\s*absoluteUrl\("\/"\)/);
  });
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { DgtRadar } from '../src/lib/radarsData';
import {
  RADAR_MAP_ALL_ROADS,
  RADAR_MAP_ALL_TYPES,
  RADAR_MAP_DEFAULT_FILTERS,
  filterRadars,
  getProvinceOptions,
  getRadarSpeedLimit,
  getRoadOptions,
} from '../src/lib/radarMapFilters';
import { buildRadarPopupHtml, escapeHtml, getRadarDetailHref } from '../src/lib/radarMapMarkers';
import { RADAR_MAP_DEFAULT_LAYER, RADAR_MAP_TILE_SOURCES } from '../src/lib/radarMapTiles';

const SOURCE_DIRECTORY = 'src';
const FORBIDDEN_IMPORT = '@/data/radars';
const FORBIDDEN_OLD_NAME = /radarPuntos/;
const BASE_PATH = '/es/multas';

function radarMapFixture(overrides: Partial<DgtRadar>): DgtRadar {
  return {
    id: 'radar-1',
    dgtLocationId: 'loc-1',
    provincia: 'Madrid',
    provinciaSlug: 'madrid',
    carretera: 'M-30',
    carreteraSlug: 'm-30',
    pk: '10,5',
    sentido: 'Creciente',
    tipo: 'Fijo',
    lat: 40.4,
    lng: -3.7,
    singularity: '',
    velocidadEstimada: 50,
    fuente: 'DGT NAP',
    fechaPublicacion: '2026-01-01',
    ...overrides,
  };
}

const RADARS: DgtRadar[] = [
  radarMapFixture({ id: 'a', provincia: 'Madrid', carretera: 'M-30', tipo: 'Fijo' }),
  radarMapFixture({ id: 'b', provincia: 'Madrid', carretera: 'A-6', tipo: 'Tramo', pk: '74' }),
  radarMapFixture({ id: 'c', provincia: 'Cádiz', carretera: 'A-381', tipo: 'Fijo', velocidadEstimada: null }),
];

function radarMapListFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? radarMapListFiles(fullPath) : [fullPath];
  });
}

function radarMapIds(radars: DgtRadar[]): string[] {
  return radars.map(radar => radar.id);
}

test('filtro: sin filtros devuelve todos los radares', () => {
  assert.deepEqual(radarMapIds(filterRadars(RADARS, RADAR_MAP_DEFAULT_FILTERS)), ['a', 'b', 'c']);
});

test('filtro: por provincia', () => {
  const filters = { ...RADAR_MAP_DEFAULT_FILTERS, provincia: 'Madrid' };
  assert.deepEqual(radarMapIds(filterRadars(RADARS, filters)), ['a', 'b']);
});

test('filtro: por tipo', () => {
  const filters = { ...RADAR_MAP_DEFAULT_FILTERS, tipo: 'Tramo' as const };
  assert.deepEqual(radarMapIds(filterRadars(RADARS, filters)), ['b']);
});

test('filtro: provincia y tipo se combinan', () => {
  const filters = { ...RADAR_MAP_DEFAULT_FILTERS, provincia: 'Cádiz', tipo: 'Tramo' as const };
  assert.deepEqual(filterRadars(RADARS, filters), []);
});

test('filtro: búsqueda por carretera o pk sin distinguir mayúsculas', () => {
  assert.deepEqual(radarMapIds(filterRadars(RADARS, { ...RADAR_MAP_DEFAULT_FILTERS, query: ' a-381 ' })), ['c']);
  assert.deepEqual(radarMapIds(filterRadars(RADARS, { ...RADAR_MAP_DEFAULT_FILTERS, query: '74' })), ['b']);
});

test('opciones: provincias únicas y ordenadas', () => {
  assert.deepEqual(getProvinceOptions(RADARS), ['Cádiz', 'Madrid']);
});

test('opciones: carreteras limitadas a la provincia elegida', () => {
  assert.deepEqual(getRoadOptions(RADARS, 'Madrid'), ['A-6', 'M-30']);
  assert.deepEqual(getRoadOptions(RADARS, RADAR_MAP_ALL_ROADS), ['A-381', 'A-6', 'M-30']);
  assert.equal(RADAR_MAP_ALL_TYPES, RADAR_MAP_DEFAULT_FILTERS.tipo);
});

test('límite: velocidadEstimada válida pasa a la calculadora', () => {
  assert.equal(getRadarSpeedLimit({ velocidadEstimada: 120 }), 120);
});

test('límite: null o valor no admitido devuelve null', () => {
  assert.equal(getRadarSpeedLimit({ velocidadEstimada: null }), null);
  assert.equal(getRadarSpeedLimit({ velocidadEstimada: 55 }), null);
  assert.equal(getRadarSpeedLimit({ velocidadEstimada: 0 }), null);
});

test('popup: enlaza a la ficha con la ruta base y ofrece el botón solo con límite válido', () => {
  const withLimit = buildRadarPopupHtml(RADARS[0], 50);
  const withoutLimit = buildRadarPopupHtml(RADARS[2], null);
  assert.ok(withLimit.includes(`href="${BASE_PATH}/radares/radar/a"`));
  assert.ok(withLimit.includes('data-radar-limit="50"'));
  assert.ok(withoutLimit.includes(`href="${BASE_PATH}/radares/radar/c"`));
  assert.ok(!withoutLimit.includes('data-radar-limit'));
  assert.equal(getRadarDetailHref({ id: 'a' }), `${BASE_PATH}/radares/radar/a`);
});

test('popup: escapa el HTML del dataset', () => {
  assert.equal(escapeHtml('<b>"x"&\'</b>'), '&lt;b&gt;&quot;x&quot;&amp;&#39;&lt;/b&gt;');
  const html = buildRadarPopupHtml(radarMapFixture({ carretera: '<script>' }), null);
  assert.ok(!html.includes('<script>'));
});

test('capas: OSM por defecto y ninguna de CARTO, que exige clave de API', () => {
  assert.equal(RADAR_MAP_DEFAULT_LAYER, 'osm');
  for (const source of Object.values(RADAR_MAP_TILE_SOURCES)) {
    assert.ok(!source.url.includes('cartocdn'), source.url);
  }
});

test('fuentes: ningún fichero de src importa @/data/radars ni contiene radarPuntos', () => {
  for (const file of radarMapListFiles(SOURCE_DIRECTORY)) {
    if (!/\.(ts|tsx)$/.test(file)) continue;
    const content = readFileSync(file, 'utf-8');
    assert.ok(!content.includes(FORBIDDEN_IMPORT), `${file} importa ${FORBIDDEN_IMPORT}`);
    assert.ok(!FORBIDDEN_OLD_NAME.test(content), `${file} contiene la marca antigua radarPuntos`);
  }
});

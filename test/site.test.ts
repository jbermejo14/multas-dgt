import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { absoluteUrl, assetPath, BASE_PATH, getSiteUrl } from '../src/lib/site';
import nextConfig from '../next.config';

const SITE_ORIGIN = 'https://ododex.com';
const SOURCE_DIRS = ['src/app', 'src/components'];

function siteConOrigen(origen: string | undefined, prueba: () => void): void {
  const previo = process.env.NEXT_PUBLIC_SITE_URL;
  if (origen === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = origen;
  try {
    prueba();
  } finally {
    if (previo === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previo;
  }
}

function siteTsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return siteTsxFiles(full);
    return full.endsWith('.tsx') ? [full] : [];
  });
}

test('BASE_PATH es /es/multas', () => {
  assert.equal(BASE_PATH, '/es/multas');
});

test('absoluteUrl: raíz vacía o con barra devuelve origen + ruta base sin barra final', () => {
  siteConOrigen(SITE_ORIGIN, () => {
    assert.equal(absoluteUrl('/'), `${SITE_ORIGIN}/es/multas`);
    assert.equal(absoluteUrl(''), `${SITE_ORIGIN}/es/multas`);
  });
});

test('absoluteUrl: ruta con y sin barra inicial', () => {
  siteConOrigen(SITE_ORIGIN, () => {
    assert.equal(absoluteUrl('/multas/utilizar-movil-conduciendo-mano'), `${SITE_ORIGIN}/es/multas/multas/utilizar-movil-conduciendo-mano`);
    assert.equal(absoluteUrl('multas/utilizar-movil-conduciendo-mano'), `${SITE_ORIGIN}/es/multas/multas/utilizar-movil-conduciendo-mano`);
  });
});

test('getSiteUrl: quita barras finales y usa localhost por defecto', () => {
  siteConOrigen(`${SITE_ORIGIN}/`, () => {
    assert.equal(getSiteUrl(), SITE_ORIGIN);
    assert.equal(absoluteUrl('/cookies'), `${SITE_ORIGIN}/es/multas/cookies`);
  });
  siteConOrigen(undefined, () => {
    assert.equal(getSiteUrl(), 'http://localhost:3000');
  });
});

test('assetPath antepone la ruta base', () => {
  assert.equal(assetPath('/brand/x.svg'), '/es/multas/brand/x.svg');
  assert.equal(assetPath('brand/x.svg'), '/es/multas/brand/x.svg');
});

// Un <a> con href interno literal se salta la ruta base; los internos van con next/link.
const RAW_INTERNAL_ANCHOR = /<a\s[^>]*href=["'{`]+\/(?!\/)/;

test('ningún .tsx de src/app ni src/components usa src="/ ni <a href="/ literales', () => {
  for (const dir of SOURCE_DIRS) {
    for (const file of siteTsxFiles(dir)) {
      const source = readFileSync(file, 'utf8');
      assert.ok(!source.includes('src="/'), `${file} contiene src="/ sin assetPath`);
      assert.doesNotMatch(source, RAW_INTERNAL_ANCHOR, `${file} tiene un <a href="/..."> sin next/link ni assetPath`);
    }
  }
});

test('el layout no define robots: la 404 debe quedar solo con el noindex de Next', () => {
  assert.doesNotMatch(readFileSync('src/app/layout.tsx', 'utf8'), /^\s*robots\s*:/m);
});

test('next.config.ts usa la misma ruta base que src/lib/site.ts', () => {
  assert.equal(nextConfig.basePath, BASE_PATH);
});

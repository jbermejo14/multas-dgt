import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import AvisoLegalPage, { metadata as avisoMetadata } from '../src/app/aviso-legal/page';
import PrivacidadPage, { metadata as privacidadMetadata } from '../src/app/privacidad/page';
import CookiesPage, { metadata as cookiesMetadata } from '../src/app/cookies/page';
import { AdSenseScript } from '../src/components/AdSenseScript';
import { Footer } from '../src/components/Footer';
import { getTitular, valorOPendiente } from '../src/lib/legal';

const TEST_ADSENSE_CLIENT = 'ca-pub-0000000000000000';

function legalConAdSense(valor: string | undefined, prueba: () => void): void {
  const previo = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (valor === undefined) delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  else process.env.NEXT_PUBLIC_ADSENSE_CLIENT = valor;
  try {
    prueba();
  } finally {
    if (previo === undefined) delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
    else process.env.NEXT_PUBLIC_ADSENSE_CLIENT = previo;
  }
}

test('aviso legal: muestra nombre del titular o marcador, y no se indexa', () => {
  const html = renderToStaticMarkup(<AvisoLegalPage />);
  assert.ok(html.includes(valorOPendiente(getTitular(), 'nombre')));
  assert.ok(html.includes('LSSI'));
  assert.deepEqual(avisoMetadata.robots, { index: false, follow: true });
});

test('privacidad: muestra el titular y menciona a la AEPD', () => {
  const html = renderToStaticMarkup(<PrivacidadPage />);
  assert.ok(html.includes(valorOPendiente(getTitular(), 'nombre')));
  assert.ok(html.includes('AEPD'));
});

test('cookies: documenta ododex-theme y el enlace de Google', () => {
  const html = renderToStaticMarkup(<CookiesPage />);
  assert.ok(html.includes('ododex-theme'));
  assert.ok(html.includes('https://policies.google.com/technologies/cookies?hl=es'));
});

test('las tres páginas legales no se indexan', () => {
  for (const metadata of [avisoMetadata, privacidadMetadata, cookiesMetadata]) {
    assert.deepEqual(metadata.robots, { index: false, follow: true });
  }
});

test('textos legales propios de esta web: DGT no oficial, OpenStreetMap y sin restos de impuestos', () => {
  const aviso = renderToStaticMarkup(<AvisoLegalPage />);
  const privacidad = renderToStaticMarkup(<PrivacidadPage />);
  const cookies = renderToStaticMarkup(<CookiesPage />);
  assert.match(aviso, /no es (una web )?oficial/i);
  assert.ok(aviso.includes('DGT'));
  assert.match(privacidad, /openstreetmap/i);
  for (const html of [aviso, privacidad, cookies]) {
    assert.doesNotMatch(html, /impuesto|AEAT|Hacienda/i);
  }
});

test('AdSenseScript no renderiza nada sin variable o con valor inválido', () => {
  legalConAdSense(undefined, () => assert.equal(AdSenseScript(), null));
  legalConAdSense('', () => assert.equal(AdSenseScript(), null));
  legalConAdSense('ca-pub-123', () => assert.equal(AdSenseScript(), null));
});

test('AdSenseScript renderiza el script con un ca-pub válido', () => {
  legalConAdSense(TEST_ADSENSE_CLIENT, () => {
    const element = AdSenseScript();
    assert.ok(element);
    assert.equal(
      element.props.src,
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${TEST_ADSENSE_CLIENT}`
    );
    assert.equal(element.props.strategy, 'afterInteractive');
    assert.equal(element.props.crossOrigin, 'anonymous');
  });
});

test('Footer: enlaces legales siempre; botón de cookies solo si se pide', () => {
  const sin = renderToStaticMarkup(<Footer />);
  for (const ruta of ['/aviso-legal', '/privacidad', '/cookies']) {
    assert.ok(sin.includes(`href="${ruta}"`), `Falta ${ruta}`);
  }
  assert.ok(!sin.includes('Configurar cookies'));
  assert.ok(renderToStaticMarkup(<Footer mostrarConsentimiento />).includes('Configurar cookies'));
});

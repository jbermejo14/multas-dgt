import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AdSlot } from '../src/components/AdSlot';

const CLIENT_VARIABLE = 'NEXT_PUBLIC_ADSENSE_CLIENT';
const SLOT_VARIABLE = 'NEXT_PUBLIC_ADSENSE_SLOT';
const VALID_CLIENT = 'ca-pub-0000000000000000';
const VALID_SLOT = '0000000000';
const MAX_SLOTS_PER_PAGE = 3;
const APP_DIRECTORY = path.join('src', 'app');
const PAGE_FILE_NAME = 'page.tsx';
const LEGAL_PAGES = ['aviso-legal', 'privacidad', 'cookies'];
const SLOT_USAGE = /<AdSlot\b/g;
const SLOT_IMPORT = /components\/AdSlot/;

function adSlotWithEnv(client: string | undefined, slot: string | undefined): string {
  const previous = { client: process.env[CLIENT_VARIABLE], slot: process.env[SLOT_VARIABLE] };
  setEnv(CLIENT_VARIABLE, client);
  setEnv(SLOT_VARIABLE, slot);
  try {
    return renderToStaticMarkup(<AdSlot />);
  } finally {
    setEnv(CLIENT_VARIABLE, previous.client);
    setEnv(SLOT_VARIABLE, previous.slot);
  }
}

function setEnv(name: string, value: string | undefined): void {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

function adListPageFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return adListPageFiles(fullPath);
    return entry.name === PAGE_FILE_NAME ? [fullPath] : [];
  });
}

function adCountSlots(file: string): number {
  return (readFileSync(file, 'utf-8').match(SLOT_USAGE) ?? []).length;
}

test('AdSlot: sin cliente o sin unidad no renderiza nada', () => {
  assert.equal(adSlotWithEnv(undefined, undefined), '');
  assert.equal(adSlotWithEnv(VALID_CLIENT, undefined), '');
  assert.equal(adSlotWithEnv(undefined, VALID_SLOT), '');
});

test('AdSlot: con valores inválidos no renderiza nada', () => {
  assert.equal(adSlotWithEnv('pub-123', VALID_SLOT), '');
  assert.equal(adSlotWithEnv(VALID_CLIENT, '123'), '');
  assert.equal(adSlotWithEnv(VALID_CLIENT, '12345678901'), '');
  assert.equal(adSlotWithEnv(VALID_CLIENT, 'abcdefghij'), '');
});

test('AdSlot: con valores válidos renderiza el bloque con su etiqueta Publicidad', () => {
  const html = adSlotWithEnv(VALID_CLIENT, VALID_SLOT);
  assert.ok(html.includes('class="adsbygoogle"'));
  assert.ok(html.includes(`data-ad-client="${VALID_CLIENT}"`));
  assert.ok(html.includes(`data-ad-slot="${VALID_SLOT}"`));
  assert.ok(html.includes('data-ad-format="auto"'));
  assert.ok(html.includes('data-full-width-responsive="true"'));
  assert.ok(html.includes('>Publicidad</span>'));
});

test('anuncios: ninguna página legal ni la 404 importa AdSlot', () => {
  const files = [
    ...LEGAL_PAGES.map(page => path.join(APP_DIRECTORY, page, PAGE_FILE_NAME)),
    path.join(APP_DIRECTORY, 'not-found.tsx')
  ];
  for (const file of files) {
    assert.ok(!SLOT_IMPORT.test(readFileSync(file, 'utf-8')), `${file} importa AdSlot`);
  }
});

test(`anuncios: ninguna página pasa de ${MAX_SLOTS_PER_PAGE} AdSlot`, () => {
  const homeSlots = adCountSlots(path.join('src', 'components', 'HomePageView.tsx'));
  assert.ok(homeSlots > 0 && homeSlots <= MAX_SLOTS_PER_PAGE, `la home tiene ${homeSlots}`);
  for (const file of adListPageFiles(APP_DIRECTORY)) {
    assert.ok(adCountSlots(file) <= MAX_SLOTS_PER_PAGE, `${file} supera ${MAX_SLOTS_PER_PAGE} AdSlot`);
  }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { InfractionsDirectoryModal } from '../src/components/InfractionsDirectoryModal';
import { INFRACTIONS_DATA } from '../src/data/infractions';

test('modal de infracciones: dialog modal etiquetado por un id existente', () => {
  const html = renderToStaticMarkup(<InfractionsDirectoryModal infraction={INFRACTIONS_DATA[0]} onClose={() => undefined} />);
  assert.match(html, /role="dialog"/);
  assert.match(html, /aria-modal="true"/);
  const labelledBy = /aria-labelledby="([^"]+)"/.exec(html);
  assert.ok(labelledBy, 'falta aria-labelledby');
  assert.ok(html.includes(`id="${labelledBy[1]}"`), 'el id referenciado no existe');
});

test('modal de infracciones: el velo usa la variable --overlay', () => {
  const html = renderToStaticMarkup(<InfractionsDirectoryModal infraction={INFRACTIONS_DATA[0]} onClose={() => undefined} />);
  assert.ok(html.includes('var(--overlay)'));
  assert.ok(!html.includes('bg-black'));
});

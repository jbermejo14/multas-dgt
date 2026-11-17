import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const MIN_TEXT_CONTRAST = 4.5;
const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const ON_ACCENT_BACKGROUND = '#C2410C';
const WHITE = '#FFFFFF';

const globalsCss = readFileSync(path.join(process.cwd(), 'src', 'app', 'globals.css'), 'utf-8').replace(/\r\n/g, '\n');

const LIGHT_THEME_BLOCK = /:root\s*,\s*\[data-theme="light"\]\s*\{([^}]*)\}/;
const DARK_THEME_BLOCK = /\[data-theme="dark"\]\s*\{([^}]*)\}/;

/** Extrae las variables de color del bloque que casa con `blockPattern` (grupo 1 = cuerpo). */
function uiReadThemeTokens(blockPattern: RegExp): Record<string, string> {
  const match = blockPattern.exec(globalsCss);
  assert.ok(match, `No se encuentra el bloque ${blockPattern} en globals.css`);
  const tokens: Record<string, string> = {};
  for (const token of match[1].matchAll(/(--[a-z-]+):\s*(#[0-9a-fA-F]{6});/g)) {
    tokens[token[1]] = token[2];
  }
  return tokens;
}

function uiChannelToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

function uiLuminance(hex: string): number {
  assert.match(hex, HEX_COLOR);
  const [red, green, blue] = [1, 3, 5].map(start => uiChannelToLinear(parseInt(hex.slice(start, start + 2), 16)));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function uiContrast(foreground: string, background: string): number {
  const [lighter, darker] = [uiLuminance(foreground), uiLuminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

const THEMES: Record<string, Record<string, string>> = {
  claro: uiReadThemeTokens(LIGHT_THEME_BLOCK),
  oscuro: uiReadThemeTokens(DARK_THEME_BLOCK)
};

const TEXT_TOKENS = ['--text-primary', '--text-secondary', '--text-muted'];
const SURFACE_TOKENS = ['--bg-body', '--bg-surface', '--bg-surface-elevated'];

for (const [themeName, tokens] of Object.entries(THEMES)) {
  test(`contraste: texto sobre fondos en tema ${themeName}`, () => {
    for (const text of TEXT_TOKENS) {
      for (const surface of SURFACE_TOKENS) {
        const ratio = uiContrast(tokens[text], tokens[surface]);
        assert.ok(ratio >= MIN_TEXT_CONTRAST, `${text} sobre ${surface} en tema ${themeName}: ${ratio.toFixed(2)}`);
      }
    }
  });

  test(`contraste: acento sobre fondo y superficie en tema ${themeName}`, () => {
    for (const surface of ['--bg-body', '--bg-surface']) {
      const ratio = uiContrast(tokens['--accent-primary'], tokens[surface]);
      assert.ok(ratio >= MIN_TEXT_CONTRAST, `--accent-primary sobre ${surface} en tema ${themeName}: ${ratio.toFixed(2)}`);
    }
  });
}

test('contraste: blanco sobre #C2410C', () => {
  assert.ok(uiContrast(WHITE, ON_ACCENT_BACKGROUND) >= MIN_TEXT_CONTRAST);
});

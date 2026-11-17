'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { SECTION_NAME } from '@/lib/site';

const THEME_STORAGE_KEY = 'ododex-theme';
const THEME_ICON_SIZE = 18;
const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

type Theme = 'dark' | 'light';

const SECTION_LINKS = [
  { label: 'Calculadora', href: '/#calculadora' },
  { label: 'Infracciones', href: '/#infracciones' },
  { label: 'Radares', href: '/radares' },
  { label: 'Preguntas', href: '/#faq' }
] as const;

/** Tema activo: el atributo de <html> que fija layout.tsx o, si falta, la preferencia del sistema. */
function currentTheme(root: HTMLElement): Theme {
  const attribute = root.getAttribute('data-theme');
  if (attribute === 'dark' || attribute === 'light') return attribute;
  const prefersDark = typeof window.matchMedia === 'function' && window.matchMedia(DARK_SCHEME_QUERY).matches;
  return prefersDark ? 'dark' : 'light';
}

function toggleTheme() {
  const root = document.documentElement;
  const next: Theme = currentTheme(root) === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Sin localStorage (modo privado, cookies bloqueadas) el tema solo dura la visita.
  }
}

export function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="brand">
          <BrandLogo />
          <span className="brand-separator" aria-hidden="true" />
          <span className="brand-section">{SECTION_NAME}</span>
        </Link>

        <div className="header-actions">
          {/* El icono y el texto de cada tema se alternan por CSS según [data-theme]. */}
          <button
            id="themeToggleBtn"
            className="theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
          >
            <span className="theme-when-dark" title="Modo claro">
              <svg viewBox="0 0 24 24" width={THEME_ICON_SIZE} height={THEME_ICON_SIZE} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <span className="theme-toggle-text sr-only md:not-sr-only">Modo claro</span>
            </span>
            <span className="theme-when-light" title="Modo oscuro">
              <svg viewBox="0 0 24 24" width={THEME_ICON_SIZE} height={THEME_ICON_SIZE} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <span className="theme-toggle-text sr-only md:not-sr-only">Modo oscuro</span>
            </span>
          </button>
        </div>
      </div>
      <nav aria-label="Secciones" className="header-nav">
        {SECTION_LINKS.map(link => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

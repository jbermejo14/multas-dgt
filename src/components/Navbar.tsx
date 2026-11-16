"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Gauge, ShieldAlert, MapPin, HelpCircle, Menu, X, Radio } from "lucide-react";

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "calculadora", label: "Calculadora de Multas", icon: Gauge, href: "#calculadora" },
    { id: "infracciones", label: "Catálogo de Infracciones", icon: ShieldAlert, href: "#infracciones" },
    { id: "radares", label: "Mapa de Radares", icon: MapPin, href: "#radares" },
    { id: "faq", label: "Preguntas Frecuentes", icon: HelpCircle, href: "#faq" },
  ];

  const handleNavClick = (id: string) => {
    if (setActiveTab) {
      setActiveTab(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-[#0D0D0D]/90 border-b border-neutral-200 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            onClick={() => handleNavClick("calculadora")}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#e05e00] text-white shadow-lg shadow-[#ff6b00]/25 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6b00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-400"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-neutral-900 dark:text-white flex items-center gap-1">
                Radar<span className="text-[#ff6b00]">Puntos</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 -mt-1">
                Consultor DGT España
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Navegación principal">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#ff6b00]/10 text-[#ff6b00] dark:bg-[#ff6b00]/20 font-semibold border border-[#ff6b00]/30"
                      : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#ff6b00]" : "text-neutral-400"}`} />
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Controls: Badge + Theme Switch */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Ley de Tráfico Actualizada
            </div>

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0D0D0D] space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "bg-[#ff6b00]/15 text-[#ff6b00] font-semibold"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#ff6b00]" : "text-neutral-400"}`} />
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}

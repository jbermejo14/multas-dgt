"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("radarpuntos_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("radarpuntos_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("radarpuntos_theme", "light");
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 border border-neutral-300 dark:border-neutral-800 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-[#ff6b00] dark:hover:border-[#ff6b00] focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[#ff6b00] transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-neutral-700 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}

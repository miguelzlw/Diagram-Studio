"use client";

import { useIsDark } from "@/lib/use-dark";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ThemeToggle() {
  const dark = useIsDark();

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* localStorage indisponível */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={dark ? "Tema claro" : "Tema escuro"}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-electric"
    >
      {dark ? <IconSun size={18} stroke={2} /> : <IconMoon size={18} stroke={2} />}
    </button>
  );
}

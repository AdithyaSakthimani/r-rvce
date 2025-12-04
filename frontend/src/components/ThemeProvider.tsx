"use client";

import * as React from "react";
import { useThemeStore } from "@/lib/store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div className="dark">
        {children}
      </div>
    );
  }

  return <>{children}</>;
}

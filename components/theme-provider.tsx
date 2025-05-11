"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { useTheme } from "next-themes";

// Custom hook to handle fallback to light mode
export function useThemeWithFallback() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  React.useEffect(() => {
    // If theme is system but resolvedTheme is undefined (detection failed)
    if (theme === "system" && !resolvedTheme) {
      // Set to light mode as fallback
      setTheme("light");
    }
  }, [theme, resolvedTheme, setTheme]);

  return { theme, setTheme, resolvedTheme };
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

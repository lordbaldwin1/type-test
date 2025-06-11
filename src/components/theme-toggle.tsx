"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <button
      className="hover:text-foreground hover:scale-110 transition-transform duration-200 text-muted-foreground cursor-pointer"
      onClick={() => {
        if (theme === "light") {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      }}
    >
      {theme === "light" ? <Sun className="h-5.5 w-5.5" /> : <Moon className="h-5.5 w-5.5" />}
    </button>
  );
}

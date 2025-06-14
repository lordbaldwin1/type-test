"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { value: "dark", label: "Dark", icon: <Moon className="inline h-4 w-4 mr-1" /> },
    { value: "serika-dark", label: "Serika Dark", icon: <span className="inline-block w-4 h-4 rounded-sm mr-1" style={{ background: "#e2b714", border: "1px solid #2c2e31" }} /> },
    { value: "matcha", label: "Matcha", icon: <span className="inline-block w-4 h-4 rounded-sm mr-1" style={{ background: "#7ec160", border: "1px solid #2c2e31" }} /> },
    { value: "light", label: "Light", icon: <Sun className="inline h-4 w-4 mr-1" /> },
  ];

  const current = themes.find(t => t.value === theme) ?? themes[0];

  if (!mounted || !current) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          {current.icon}
          {current.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          {themes.map(t => (
            <DropdownMenuRadioItem key={t.value} value={t.value}>
              <span className="flex items-center gap-2">{t.icon}{t.label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

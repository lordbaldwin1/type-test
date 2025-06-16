"use client";

import * as React from "react";
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
    { value: "dark", label: "Dark", icon: <span className="w-4 h-4 rounded-sm" style={{ background: "#23251f", border: "1px solid #2c2e31" }} /> },
    { value: "light-rose", label: "Light Rose", icon: <span className="w-4 h-4 rounded-sm" style={{ background: "#FFE4E1", border: "1px solid #2c2e31" }} /> },
    { value: "blue", label: "Blue", icon: <span className="w-4 h-4 rounded-sm" style={{ background: "#176161", border: "1px solid #2c2e31" }} /> },
    { value: "rose", label: "Rose", icon: <span className="w-4 h-4 rounded-sm" style={{ background: "#FF007F", border: "1px solid #2c2e31" }} /> },
    { value: "purple", label: "Purple", icon: <span className="w-4 h-4 rounded-sm" style={{ background: "#562EB4", border: "1px solid #2c2e31" }} /> },
    { value: "serika-dark", label: "Serika Dark", icon: <span className="w-4 h-4 rounded-sm" style={{ background: "#e2b714", border: "1px solid #2c2e31" }} /> },
    { value: "light", label: "Light", icon: <span className="w-4 h-4 rounded-sm" style={{ background: "#ffffff", border: "1px solid #2c2e31" }} /> },
  ];

  const current = themes.find(t => t.value === theme) ?? themes[0];

  if (!mounted || !current) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center justify-center">
          {current.icon}
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

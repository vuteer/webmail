"use client";
// theme toggle button for dark & light
import React from "react";

import { useTheme } from "next-themes";
import { Moon, Sun, SunMedium } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Button size="icon" variant="secondary" />;
  return (
    <div
      className={cn(
        "border border-background flex gap-1 bg-secondary rounded-full",
      )}
    >
      <Button
        size={"sm"}
        variant="secondary"
        className={cn(
          theme === "light" ? "bg-background" : "",
          "rounded-full hover:bg-background duration-700 hover:text-main-color",
        )}
        onClick={() => setTheme("light")}
      >
        <SunMedium size={18} />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          theme === "dark" ? "bg-background" : "",
          "rounded-full hover:bg-background duration-700 hover:text-main-color",
        )}
        onClick={() => setTheme("dark")}
      >
        <Moon size={18} />
      </Button>
    </div>
  );
}
// <Button className={"bg-background hover:bg-transparent duration-700"} variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark": "light")}>
//     {(theme === "light") ? <Moon  size={20}/>: <Sun  size={20}/>}
// </Button>

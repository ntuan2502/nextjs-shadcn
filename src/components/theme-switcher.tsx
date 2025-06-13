"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Monitor, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex items-center gap-2 p-2">
      <Button
        variant="ghost"
        size="icon"
        className={`size-8 rounded-md ${theme === "light" ? "bg-accent text-accent-foreground" : ""}`}
        onClick={() => setTheme("light")}
        aria-label="Light theme"
      >
        <Sun className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`size-8 rounded-md ${theme === "dark" ? "bg-accent text-accent-foreground" : ""}`}
        onClick={() => setTheme("dark")}
        aria-label="Dark theme"
      >
        <Moon className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`size-8 rounded-md ${theme === "system" ? "bg-accent text-accent-foreground" : ""}`}
        onClick={() => setTheme("system")}
        aria-label="System theme"
      >
        <Monitor className="size-4" />
      </Button>
    </div>
  )
}

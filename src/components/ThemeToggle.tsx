import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-lg",
        "transition-all duration-200",
        "bg-secondary hover:bg-secondary/80",
        "border border-border",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      )}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative h-5 w-5">
        {/* Sun icon - shown in dark mode (click to go light) */}
        <Sun
          className={cn(
            "absolute inset-0 h-5 w-5 text-yellow-400 transition-all duration-300",
            theme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          )}
        />
        {/* Moon icon - shown in light mode (click to go dark) */}
        <Moon
          className={cn(
            "absolute inset-0 h-5 w-5 text-slate-700 transition-all duration-300",
            theme === "light"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          )}
        />
      </div>
    </button>
  );
}

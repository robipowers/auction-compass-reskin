import { useExecutionMode, ExecutionMode } from "@/contexts/ExecutionModeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ExecutionModeToggle = () => {
  const { mode, setMode } = useExecutionMode();

  const modes: { value: ExecutionMode; label: string }[] = [
    { value: "sim", label: "SIM" },
    { value: "live", label: "LIVE" },
  ];

  return (
    <div className="flex items-center rounded-md border border-border overflow-hidden">
      {modes.map(({ value, label }) => (
        <Button
          key={value}
          variant="ghost"
          size="sm"
          onClick={() => setMode(value)}
          className={cn(
            "h-7 px-3 rounded-none text-xs font-medium transition-colors",
            mode === value
              ? value === "live"
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-primary/20 text-primary hover:bg-primary/30"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

import { useExecutionMode, ExecutionMode } from "@/contexts/ExecutionModeContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Swords, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExecutionModeToggle({ className }: { className?: string }) {
  const { mode, setMode } = useExecutionMode();

  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(v) => v && setMode(v as ExecutionMode)}
      className={cn("border border-border/50 rounded-lg p-0.5 bg-secondary/30", className)}
    >
      <ToggleGroupItem
        value="sim"
        aria-label="Simulation mode"
        className="text-xs h-7 px-3 gap-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm"
      >
        <BookOpen className="h-3.5 w-3.5" />
        Sim
      </ToggleGroupItem>
      <ToggleGroupItem
        value="live"
        aria-label="Live mode"
        className="text-xs h-7 px-3 gap-1.5 data-[state=on]:bg-danger/90 data-[state=on]:text-white data-[state=on]:shadow-sm"
      >
        <Swords className="h-3.5 w-3.5" />
        Live
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
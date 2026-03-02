import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Minus,
  SeparatorVertical,
  MoveRight,
  Square,
  Circle,
  Triangle,
  Layers,
  AlignHorizontalJustifyCenter,
  GitBranch,
  Type,
  MessageSquare,
  ArrowRight,
  MousePointer,
  Eraser,
  Undo,
  Redo,
} from "lucide-react";

export type DrawingTool =
  | "select"
  | "trendline"
  | "horizontal"
  | "vertical"
  | "ray"
  | "rectangle"
  | "circle"
  | "triangle"
  | "support-zone"
  | "resistance-zone"
  | "balance-zone"
  | "imbalance-zone"
  | "fib-retracement"
  | "fib-extension"
  | "text"
  | "callout"
  | "arrow"
  | "eraser";

interface ToolConfig {
  id: DrawingTool;
  icon: typeof TrendingUp;
  label: string;
  group: "select" | "lines" | "shapes" | "zones" | "fibonacci" | "text" | "utility";
}

const tools: ToolConfig[] = [
  { id: "select", icon: MousePointer, label: "Select", group: "select" },
  { id: "trendline", icon: TrendingUp, label: "Trendline", group: "lines" },
  { id: "horizontal", icon: Minus, label: "Horizontal Line", group: "lines" },
  { id: "vertical", icon: SeparatorVertical, label: "Vertical Line", group: "lines" },
  { id: "ray", icon: MoveRight, label: "Ray", group: "lines" },
  { id: "rectangle", icon: Square, label: "Rectangle", group: "shapes" },
  { id: "circle", icon: Circle, label: "Circle", group: "shapes" },
  { id: "triangle", icon: Triangle, label: "Triangle", group: "shapes" },
  { id: "support-zone", icon: Layers, label: "Support Zone", group: "zones" },
  { id: "resistance-zone", icon: Layers, label: "Resistance Zone", group: "zones" },
  { id: "balance-zone", icon: AlignHorizontalJustifyCenter, label: "Balance Zone", group: "zones" },
  { id: "imbalance-zone", icon: AlignHorizontalJustifyCenter, label: "Imbalance Zone", group: "zones" },
  { id: "fib-retracement", icon: GitBranch, label: "Fib Retracement", group: "fibonacci" },
  { id: "fib-extension", icon: GitBranch, label: "Fib Extension", group: "fibonacci" },
  { id: "text", icon: Type, label: "Text Label", group: "text" },
  { id: "callout", icon: MessageSquare, label: "Callout", group: "text" },
  { id: "arrow", icon: ArrowRight, label: "Arrow", group: "text" },
  { id: "eraser", icon: Eraser, label: "Eraser", group: "utility" },
];

interface DrawingToolbarProps {
  activeTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function DrawingToolbar({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  orientation = "vertical",
  className,
}: DrawingToolbarProps) {
  const groups = [
    { id: "select", label: "Selection" },
    { id: "lines", label: "Lines" },
    { id: "zones", label: "Zones" },
    { id: "fibonacci", label: "Fibonacci" },
    { id: "text", label: "Text" },
    { id: "utility", label: "Utility" },
  ];

  const isVertical = orientation === "vertical";

  return (
    <div
      className={cn(
        "bg-secondary/50 border border-border rounded-lg p-2",
        isVertical ? "space-y-2" : "flex items-center gap-2",
        className
      )}
    >
      {groups.map((group, groupIndex) => {
        const groupTools = tools.filter((t) => t.group === group.id);
        if (groupTools.length === 0) return null;

        return (
          <div key={group.id}>
            {groupIndex > 0 && (
              <Separator className={isVertical ? "my-2" : "mx-1 h-8"} orientation={isVertical ? "horizontal" : "vertical"} />
            )}
            <div
              className={cn(
                isVertical ? "space-y-1" : "flex gap-1"
              )}
            >
              {groupTools.map((tool) => (
                <Tooltip key={tool.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeTool === tool.id ? "default" : "ghost"}
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        activeTool === tool.id && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => onToolChange(tool.id)}
                    >
                      <tool.icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={isVertical ? "right" : "bottom"}>
                    {tool.label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        );
      })}

      {/* Undo/Redo */}
      <Separator className={isVertical ? "my-2" : "mx-1 h-8"} orientation={isVertical ? "horizontal" : "vertical"} />
      <div className={cn(isVertical ? "space-y-1" : "flex gap-1")}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isVertical ? "right" : "bottom"}>
            Undo (Ctrl+Z)
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onRedo}
              disabled={!canRedo}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isVertical ? "right" : "bottom"}>
            Redo (Ctrl+Y)
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface BalanceZone {
  id: string;
  type: "balance" | "imbalance";
  priceHigh: number;
  priceLow: number;
  startTime: Date;
  endTime?: Date;
  volume: number;
  status: "active" | "broken";
}

export interface AMTLevel {
  type: "poc" | "vah" | "val" | "ib-high" | "ib-low" | "previous-poc" | "previous-vah" | "previous-val";
  price: number;
  label: string;
  session: "current" | "previous";
}

interface AMTOverlaysProps {
  balanceZones: BalanceZone[];
  imbalanceZones: BalanceZone[];
  levels: AMTLevel[];
  chartHeight: number;
  chartWidth: number;
  priceRange: { high: number; low: number };
  showBalance?: boolean;
  showImbalance?: boolean;
  showInitialBalance?: boolean;
  showPreviousSession?: boolean;
  className?: string;
}

export function AMTOverlays({
  balanceZones,
  imbalanceZones,
  levels,
  chartHeight,
  chartWidth,
  priceRange,
  showBalance = true,
  showImbalance = true,
  showInitialBalance = true,
  showPreviousSession = true,
  className,
}: AMTOverlaysProps) {
  const priceToY = (price: number) => {
    const range = priceRange.high - priceRange.low;
    return ((priceRange.high - price) / range) * chartHeight;
  };

  const priceToHeight = (high: number, low: number) => {
    const range = priceRange.high - priceRange.low;
    return ((high - low) / range) * chartHeight;
  };

  const filteredLevels = useMemo(() => {
    return levels.filter((level) => {
      if (level.type.startsWith("previous-") && !showPreviousSession) return false;
      if (level.type.startsWith("ib-") && !showInitialBalance) return false;
      return true;
    });
  }, [levels, showPreviousSession, showInitialBalance]);

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {/* Balance Zones */}
      {showBalance && balanceZones.map((zone) => (
        <Tooltip key={zone.id}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "absolute left-0 right-0 pointer-events-auto cursor-pointer transition-opacity",
                zone.status === "active"
                  ? "bg-blue-500/15 border-y border-blue-500/40"
                  : "bg-blue-500/5 border-y border-blue-500/20 opacity-50"
              )}
              style={{
                top: priceToY(zone.priceHigh),
                height: priceToHeight(zone.priceHigh, zone.priceLow),
              }}
            >
              <span className="absolute left-2 top-1 text-[9px] font-medium text-blue-400">
                Balance
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs space-y-1">
              <div className="font-semibold">Balance Zone</div>
              <div>Range: {zone.priceLow.toLocaleString()} - {zone.priceHigh.toLocaleString()}</div>
              <div>Volume: {zone.volume.toLocaleString()} contracts</div>
              <div>Duration: {formatDuration(zone.startTime, zone.endTime)}</div>
              <div className={cn(
                "font-medium",
                zone.status === "active" ? "text-green-400" : "text-muted-foreground"
              )}>
                Status: {zone.status === "active" ? "Active (price within range)" : "Broken"}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}

      {/* Imbalance Zones */}
      {showImbalance && imbalanceZones.map((zone) => (
        <Tooltip key={zone.id}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "absolute left-0 right-0 pointer-events-auto cursor-pointer",
                zone.status === "active"
                  ? "bg-red-500/15 border-y border-dashed border-red-500/40"
                  : "bg-red-500/5 border-y border-dashed border-red-500/20 opacity-50"
              )}
              style={{
                top: priceToY(zone.priceHigh),
                height: priceToHeight(zone.priceHigh, zone.priceLow),
              }}
            >
              <span className="absolute right-2 top-1 text-[9px] font-medium text-red-400">
                Imbalance
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs space-y-1">
              <div className="font-semibold">Imbalance Zone (Single Prints)</div>
              <div>Range: {zone.priceLow.toLocaleString()} - {zone.priceHigh.toLocaleString()}</div>
              <div className="text-amber-400">Minimal volume - fast price movement</div>
              <div>Status: {zone.status === "active" ? "Unfilled" : "Filled"}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}

      {/* AMT Levels */}
      {filteredLevels.map((level, i) => (
        <div
          key={`${level.type}-${i}`}
          className="absolute left-0 right-0"
          style={{ top: priceToY(level.price) }}
        >
          <div
            className={cn(
              "h-px",
              level.type === "poc" && "bg-amber-500",
              level.type === "vah" && "bg-green-500",
              level.type === "val" && "bg-green-500",
              level.type.startsWith("ib-") && "bg-purple-500 border-dashed",
              level.type.startsWith("previous-") && "border-dashed opacity-60",
              level.type === "previous-poc" && "bg-amber-500/60",
              level.type === "previous-vah" && "bg-green-500/60",
              level.type === "previous-val" && "bg-green-500/60"
            )}
            style={{
              borderTopWidth: level.type.includes("dashed") || level.session === "previous" ? 1 : 0,
              borderTopStyle: "dashed",
            }}
          />
          <span
            className={cn(
              "absolute text-[9px] font-bold px-1 rounded-sm",
              level.type === "poc" && "bg-amber-500 text-amber-950",
              level.type === "vah" && "bg-green-500 text-green-950",
              level.type === "val" && "bg-green-500 text-green-950",
              level.type.startsWith("ib-") && "bg-purple-500 text-purple-950",
              level.session === "previous" && "opacity-70"
            )}
            style={{
              right: level.session === "previous" ? 4 : undefined,
              left: level.session === "current" ? 4 : undefined,
              top: -8,
            }}
          >
            {level.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function formatDuration(start: Date, end?: Date): string {
  const endTime = end || new Date();
  const diffMs = endTime.getTime() - start.getTime();
  const minutes = Math.floor(diffMs / 60000);
  
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

// Mock data generator
export function generateMockAMTData(basePrice: number = 18400): {
  balanceZones: BalanceZone[];
  imbalanceZones: BalanceZone[];
  levels: AMTLevel[];
} {
  const now = new Date();
  
  return {
    balanceZones: [
      {
        id: "bz1",
        type: "balance",
        priceHigh: basePrice + 30,
        priceLow: basePrice + 10,
        startTime: new Date(now.getTime() - 45 * 60000),
        volume: 12500,
        status: "active",
      },
      {
        id: "bz2",
        type: "balance",
        priceHigh: basePrice - 20,
        priceLow: basePrice - 40,
        startTime: new Date(now.getTime() - 120 * 60000),
        endTime: new Date(now.getTime() - 90 * 60000),
        volume: 8200,
        status: "broken",
      },
    ],
    imbalanceZones: [
      {
        id: "iz1",
        type: "imbalance",
        priceHigh: basePrice + 55,
        priceLow: basePrice + 45,
        startTime: new Date(now.getTime() - 30 * 60000),
        volume: 450,
        status: "active",
      },
    ],
    levels: [
      { type: "poc", price: basePrice + 20, label: "POC 18,420", session: "current" },
      { type: "vah", price: basePrice + 50, label: "VAH 18,450", session: "current" },
      { type: "val", price: basePrice - 10, label: "VAL 18,390", session: "current" },
      { type: "ib-high", price: basePrice + 60, label: "IB High", session: "current" },
      { type: "ib-low", price: basePrice - 5, label: "IB Low", session: "current" },
      { type: "previous-poc", price: basePrice - 30, label: "yPOC", session: "previous" },
      { type: "previous-vah", price: basePrice + 35, label: "yVAH", session: "previous" },
      { type: "previous-val", price: basePrice - 60, label: "yVAL", session: "previous" },
    ],
  };
}

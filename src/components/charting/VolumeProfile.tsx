import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ProfileType = "tpo" | "volume" | "market";
export type ProfilePeriod = "session" | "day" | "week" | "custom";

export interface VolumeLevel {
  price: number;
  volume: number;
  tpoCount?: number;
  bidVolume?: number;
  askVolume?: number;
}

export interface VolumeProfileData {
  levels: VolumeLevel[];
  poc: number;           // Point of Control price
  vah: number;           // Value Area High
  val: number;           // Value Area Low
  totalVolume: number;
  highPrice: number;
  lowPrice: number;
}

interface VolumeProfileProps {
  data: VolumeProfileData;
  height?: number;
  width?: number;
  showPreviousSession?: boolean;
  previousData?: VolumeProfileData;
  valueAreaPercent?: number;
  className?: string;
}

export function VolumeProfile({
  data,
  height = 400,
  width = 200,
  showPreviousSession = false,
  previousData,
  valueAreaPercent = 70,
  className,
}: VolumeProfileProps) {
  const maxVolume = useMemo(() => {
    return Math.max(...data.levels.map((l) => l.volume));
  }, [data]);

  const priceRange = data.highPrice - data.lowPrice;
  const priceToY = (price: number) => {
    return ((data.highPrice - price) / priceRange) * height;
  };

  const levelHeight = height / data.levels.length;

  return (
    <div className={cn("relative", className)} style={{ height, width }}>
      {/* Previous Session Reference Lines */}
      {showPreviousSession && previousData && (
        <>
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-amber-500/50"
            style={{ top: priceToY(previousData.poc) }}
          >
            <span className="absolute -right-2 -top-3 text-[10px] text-amber-500 bg-background px-1">
              yPOC
            </span>
          </div>
          <div
            className="absolute left-0 right-0 border-t border-dashed border-green-500/40"
            style={{ top: priceToY(previousData.vah) }}
          >
            <span className="absolute -right-2 -top-3 text-[10px] text-green-500 bg-background px-1">
              yVAH
            </span>
          </div>
          <div
            className="absolute left-0 right-0 border-t border-dashed border-green-500/40"
            style={{ top: priceToY(previousData.val) }}
          >
            <span className="absolute -right-2 -top-3 text-[10px] text-green-500 bg-background px-1">
              yVAL
            </span>
          </div>
        </>
      )}

      {/* Volume Bars */}
      <div className="absolute inset-0 flex flex-col">
        {data.levels.map((level, i) => {
          const barWidth = (level.volume / maxVolume) * 100;
          const isPoc = level.price === data.poc;
          const isValueArea = level.price <= data.vah && level.price >= data.val;
          const volumePercent = ((level.volume / data.totalVolume) * 100).toFixed(1);

          return (
            <Tooltip key={level.price}>
              <TooltipTrigger asChild>
                <div
                  className="relative flex items-center cursor-pointer group"
                  style={{ height: levelHeight }}
                >
                  <div
                    className={cn(
                      "h-[90%] transition-all duration-150",
                      isPoc
                        ? "bg-amber-500"
                        : isValueArea
                        ? "bg-primary/60"
                        : "bg-primary/30",
                      "group-hover:brightness-125"
                    )}
                    style={{ width: `${barWidth}%` }}
                  />
                  {isPoc && (
                    <span className="absolute right-full mr-2 text-[10px] font-bold text-amber-500 whitespace-nowrap">
                      POC {level.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs">
                <div className="space-y-1">
                  <div className="font-semibold">
                    {level.price.toLocaleString()}
                  </div>
                  <div>
                    {level.volume.toLocaleString()} contracts ({volumePercent}%)
                  </div>
                  {level.tpoCount && (
                    <div className="text-muted-foreground">
                      TPO Count: {level.tpoCount}
                    </div>
                  )}
                  {isPoc && (
                    <div className="text-amber-500 font-medium">
                      Point of Control
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* VAH/VAL Lines */}
      <div
        className="absolute left-0 right-0 border-t-2 border-green-500"
        style={{ top: priceToY(data.vah) }}
      >
        <span className="absolute left-0 -top-4 text-[10px] font-bold text-green-500 bg-background px-1 rounded">
          VAH {data.vah.toLocaleString()}
        </span>
      </div>
      <div
        className="absolute left-0 right-0 border-t-2 border-green-500"
        style={{ top: priceToY(data.val) }}
      >
        <span className="absolute left-0 -top-4 text-[10px] font-bold text-green-500 bg-background px-1 rounded">
          VAL {data.val.toLocaleString()}
        </span>
      </div>

      {/* Legend */}
      <div className="absolute -bottom-6 left-0 right-0 flex gap-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 bg-amber-500 rounded-sm" />
          <span>POC</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 bg-primary/60 rounded-sm" />
          <span>Value Area ({valueAreaPercent}%)</span>
        </div>
      </div>
    </div>
  );
}

// Mock data generator for development
export function generateMockVolumeProfile(
  basePrice: number = 18400,
  numLevels: number = 20
): VolumeProfileData {
  const levels: VolumeLevel[] = [];
  let totalVolume = 0;
  
  for (let i = 0; i < numLevels; i++) {
    const price = basePrice + i * 5;
    // Bell curve distribution centered around middle
    const distFromCenter = Math.abs(i - numLevels / 2);
    const volume = Math.floor(
      Math.random() * 1000 + 2000 * Math.exp(-distFromCenter / 5)
    );
    totalVolume += volume;
    levels.push({
      price,
      volume,
      tpoCount: Math.floor(volume / 200),
    });
  }

  // Find POC (highest volume)
  const pocLevel = levels.reduce((max, l) => (l.volume > max.volume ? l : max));
  
  // Calculate value area (70% of volume around POC)
  const sortedByVolume = [...levels].sort((a, b) => b.volume - a.volume);
  let vaVolume = 0;
  const vaTarget = totalVolume * 0.7;
  const vaLevels: number[] = [];
  
  for (const level of sortedByVolume) {
    if (vaVolume >= vaTarget) break;
    vaVolume += level.volume;
    vaLevels.push(level.price);
  }
  
  const vah = Math.max(...vaLevels);
  const val = Math.min(...vaLevels);

  return {
    levels,
    poc: pocLevel.price,
    vah,
    val,
    totalVolume,
    highPrice: basePrice + (numLevels - 1) * 5,
    lowPrice: basePrice,
  };
}

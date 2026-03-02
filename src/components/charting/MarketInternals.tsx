import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity,
  Bell,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface InternalMetric {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  history: number[];
  extremeHigh?: number;
  extremeLow?: number;
}

interface MarketInternalsData {
  tick: InternalMetric;
  trin: InternalMetric;
  add: InternalMetric;
  vix: InternalMetric;
  breadth: InternalMetric;
}

interface MarketInternalsProps {
  data: MarketInternalsData;
  onSetAlert?: (symbol: string, threshold: number) => void;
  className?: string;
}

function Sparkline({ data, color = "primary" }: { data: number[]; color?: string }) {
  if (data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  
  return (
    <svg width="80" height="24" className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color === "positive" ? "#10b981" : color === "negative" ? "#ef4444" : "currentColor"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-70"
      />
    </svg>
  );
}

function MetricCard({
  metric,
  expanded,
  onToggle,
  onSetAlert,
}: {
  metric: InternalMetric;
  expanded: boolean;
  onToggle: () => void;
  onSetAlert?: (symbol: string, threshold: number) => void;
}) {
  const isExtreme = metric.extremeHigh !== undefined && metric.extremeLow !== undefined
    ? metric.value >= metric.extremeHigh || metric.value <= metric.extremeLow
    : false;
  
  const isExtremeHigh = metric.extremeHigh !== undefined && metric.value >= metric.extremeHigh;
  const isExtremeLow = metric.extremeLow !== undefined && metric.value <= metric.extremeLow;

  return (
    <div
      className={cn(
        "p-3 rounded-lg border transition-all cursor-pointer",
        isExtreme
          ? "border-amber-500/50 bg-amber-500/10"
          : "border-border bg-secondary/30 hover:bg-secondary/50"
      )}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {metric.symbol}
              </span>
              {isExtreme && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[10px] px-1.5",
                    isExtremeHigh && "bg-green-500/20 text-green-400 border-green-500/50",
                    isExtremeLow && "bg-red-500/20 text-red-400 border-red-500/50"
                  )}
                >
                  {isExtremeHigh ? "EXTREME HIGH" : "EXTREME LOW"}
                </Badge>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-xl font-bold",
                metric.value > 0 && metric.symbol !== "$VIX" && "text-green-400",
                metric.value < 0 && "text-red-400"
              )}>
                {metric.value >= 0 && metric.symbol !== "$VIX" ? "+" : ""}
                {metric.value.toLocaleString(undefined, { 
                  minimumFractionDigits: metric.symbol === "$TRIN" ? 2 : 0,
                  maximumFractionDigits: metric.symbol === "$TRIN" ? 2 : 0,
                })}
              </span>
              <span className={cn(
                "text-xs",
                metric.change > 0 ? "text-green-400" : metric.change < 0 ? "text-red-400" : "text-muted-foreground"
              )}>
                {metric.change > 0 ? "+" : ""}{metric.change.toFixed(metric.symbol === "$TRIN" ? 2 : 0)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Sparkline 
            data={metric.history} 
            color={metric.change >= 0 ? "positive" : "negative"} 
          />
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{metric.name}</span>
            {metric.extremeHigh && metric.extremeLow && (
              <span>
                Extreme: {metric.extremeLow.toLocaleString()} / {metric.extremeHigh.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onSetAlert?.(metric.symbol, metric.extremeHigh || metric.value * 1.1);
              }}
            >
              <Bell className="h-3 w-3 mr-1" />
              Set Alert
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Full Chart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function MarketInternals({ data, onSetAlert, className }: MarketInternalsProps) {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  const metrics = [
    data.tick,
    data.trin,
    data.add,
    data.vix,
    data.breadth,
  ];

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Market Internals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.symbol}
            metric={metric}
            expanded={expandedMetric === metric.symbol}
            onToggle={() => 
              setExpandedMetric(expandedMetric === metric.symbol ? null : metric.symbol)
            }
            onSetAlert={onSetAlert}
          />
        ))}
      </CardContent>
    </Card>
  );
}

// Mock data generator
export function generateMockInternals(): MarketInternalsData {
  const generateHistory = (base: number, variance: number) => {
    return Array.from({ length: 20 }, () => 
      base + (Math.random() - 0.5) * variance
    );
  };

  return {
    tick: {
      symbol: "$TICK",
      name: "NYSE TICK Index",
      value: 845,
      change: 120,
      changePercent: 16.5,
      history: generateHistory(600, 400),
      extremeHigh: 1000,
      extremeLow: -1000,
    },
    trin: {
      symbol: "$TRIN",
      name: "Arms Index",
      value: 0.85,
      change: -0.12,
      changePercent: -12.4,
      history: generateHistory(1.0, 0.5),
      extremeHigh: 2.0,
      extremeLow: 0.5,
    },
    add: {
      symbol: "$ADD",
      name: "NYSE Advance/Decline",
      value: 1250,
      change: 340,
      changePercent: 37.4,
      history: generateHistory(800, 600),
    },
    vix: {
      symbol: "$VIX",
      name: "Volatility Index",
      value: 14.5,
      change: -0.8,
      changePercent: -5.2,
      history: generateHistory(15, 3),
      extremeHigh: 25,
      extremeLow: 12,
    },
    breadth: {
      symbol: "BREADTH",
      name: "% Above 50-Day MA",
      value: 62,
      change: 3,
      changePercent: 5.1,
      history: generateHistory(58, 10),
    },
  };
}

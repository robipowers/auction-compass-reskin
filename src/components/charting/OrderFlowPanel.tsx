import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface DeltaBar {
  time: string;
  delta: number;
  volume: number;
}

interface FootprintLevel {
  price: number;
  bid: number;
  ask: number;
}

interface OrderFlowData {
  deltaBars: DeltaBar[];
  cumulativeDelta: number;
  sessionDelta: number;
  footprint: FootprintLevel[];
  divergences: Array<{ type: "bullish" | "bearish"; price: number; time: string }>;
}

interface OrderFlowPanelProps {
  data: OrderFlowData;
  height?: number;
  className?: string;
}

export function OrderFlowPanel({ data, height = 300, className }: OrderFlowPanelProps) {
  const [activeTab, setActiveTab] = useState("cumulative");

  const maxDelta = useMemo(() => {
    return Math.max(...data.deltaBars.map((d) => Math.abs(d.delta)));
  }, [data]);

  const imbalances = useMemo(() => {
    return data.footprint.filter((level) => {
      const ratio = Math.max(level.bid, level.ask) / Math.min(level.bid, level.ask);
      return ratio > 2.5;
    });
  }, [data]);

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Order Flow Analysis</CardTitle>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Cum. Delta:</span>
              <span className={cn(
                "font-bold",
                data.cumulativeDelta > 0 ? "text-green-500" : "text-red-500"
              )}>
                {data.cumulativeDelta > 0 ? "+" : ""}
                {data.cumulativeDelta.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Session:</span>
              <span className={cn(
                "font-bold",
                data.sessionDelta > 0 ? "text-green-500" : "text-red-500"
              )}>
                {data.sessionDelta > 0 ? "+" : ""}
                {data.sessionDelta.toLocaleString()}
              </span>
            </div>
            {data.divergences.length > 0 && (
              <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {data.divergences[0].type} divergence
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="delta">Delta</TabsTrigger>
            <TabsTrigger value="cumulative">Cumulative Delta</TabsTrigger>
            <TabsTrigger value="footprint">Footprint</TabsTrigger>
          </TabsList>
          <TabsContent value="delta" className="mt-0">
            <div className="relative bg-background/50 rounded-lg border border-border p-4" style={{ height }}>
              <div className="absolute left-0 right-0 top-1/2 h-px bg-muted-foreground/30" />
              <div className="flex items-center justify-around h-full">
                {data.deltaBars.map((bar, i) => {
                  const barHeight = (Math.abs(bar.delta) / maxDelta) * 45;
                  const isPositive = bar.delta > 0;
                  return (
                    <div key={i} className="flex flex-col items-center" style={{ height: "100%" }}>
                      <div className="relative flex items-end justify-center" style={{ height: "50%", width: 24 }}>
                        {isPositive && (
                          <div className="w-5 bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm" style={{ height: `${barHeight}%` }} />
                        )}
                      </div>
                      <div className="relative flex items-start justify-center" style={{ height: "50%", width: 24 }}>
                        {!isPositive && (
                          <div className="w-5 bg-gradient-to-b from-red-600 to-red-400 rounded-b-sm" style={{ height: `${barHeight}%` }} />
                        )}
                      </div>
                      <span className="absolute -bottom-4 text-[9px] text-muted-foreground">{bar.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="cumulative" className="mt-0">
            <div className="relative bg-background/50 rounded-lg border border-border p-4" style={{ height }}>
              <svg width="100%" height="100%" className="overflow-visible">
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeOpacity="0.2" />
                <polyline fill="none" stroke={data.cumulativeDelta >= 0 ? "#10b981" : "#ef4444"} strokeWidth="2"
                  points={data.deltaBars.reduce<{ x: number; y: number; cumDelta: number }[]>((acc, bar, i) => {
                    const prevDelta = acc.length > 0 ? acc[acc.length - 1].cumDelta : 0;
                    const cumDelta = prevDelta + bar.delta;
                    const x = (i / (data.deltaBars.length - 1)) * 100;
                    const y = 50 - (cumDelta / (maxDelta * data.deltaBars.length)) * 40;
                    acc.push({ x, y, cumDelta });
                    return acc;
                  }, []).map((p) => `${p.x}%,${p.y}%`).join(" ")}
                />
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="4" />
              </svg>
              <div className="absolute top-2 right-2 flex items-center gap-2">
                {data.cumulativeDelta >= 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                <span className={cn("text-lg font-bold", data.cumulativeDelta >= 0 ? "text-green-500" : "text-red-500")}>
                  {data.cumulativeDelta >= 0 ? "+" : ""}{data.cumulativeDelta.toLocaleString()}
                </span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="footprint" className="mt-0">
            <div className="bg-background/50 rounded-lg border border-border overflow-auto" style={{ height }}>
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-secondary">
                  <tr>
                    <th className="py-2 px-3 text-left text-red-400">Bid</th>
                    <th className="py-2 px-3 text-center text-muted-foreground">Price</th>
                    <th className="py-2 px-3 text-right text-green-400">Ask</th>
                  </tr>
                </thead>
                <tbody>
                  {data.footprint.map((level, i) => {
                    const isBidImbalance = level.bid > level.ask * 2.5;
                    const isAskImbalance = level.ask > level.bid * 2.5;
                    return (
                      <tr key={i} className="border-b border-border/50">
                        <td className={cn("py-1.5 px-3 text-left", isBidImbalance && "bg-red-500/20 font-bold text-red-400")}>{level.bid.toLocaleString()}</td>
                        <td className="py-1.5 px-3 text-center text-muted-foreground font-medium">{level.price.toLocaleString()}</td>
                        <td className={cn("py-1.5 px-3 text-right", isAskImbalance && "bg-green-500/20 font-bold text-green-400")}>{level.ask.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span>Imbalances: {imbalances.length}</span>
              <span className="text-red-400">Bid absorption</span>
              <span className="text-green-400">Ask absorption</span>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export function generateMockOrderFlow(): OrderFlowData {
  const deltaBars: DeltaBar[] = [];
  let cumDelta = 0;
  for (let i = 0; i < 12; i++) {
    const delta = Math.floor(Math.random() * 2000) - 800;
    cumDelta += delta;
    deltaBars.push({ time: `${9 + Math.floor(i / 4)}:${(i % 4) * 15 || "00"}`, delta, volume: Math.floor(Math.random() * 5000) + 2000 });
  }
  const footprint: FootprintLevel[] = [];
  for (let i = 0; i < 8; i++) {
    footprint.push({ price: 18455 - i * 5, bid: Math.floor(Math.random() * 1200) + 200, ask: Math.floor(Math.random() * 1200) + 200 });
  }
  return { deltaBars, cumulativeDelta: cumDelta, sessionDelta: Math.floor(cumDelta * 0.6), footprint, divergences: cumDelta > 1000 ? [] : [{ type: "bearish", price: 18450, time: "10:30" }] };
}

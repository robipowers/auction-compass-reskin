import { useMarketData } from "@/contexts/MarketDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";

export function RealTimePriceWidget() {
  const { marketData, connectionStatus, settings } = useMarketData();

  const isPositive = marketData && marketData.change > 0;
  const isNegative = marketData && marketData.change < 0;

  return (
    <Card className="border-border/50 bg-gradient-to-br from-background to-secondary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span>{settings.primarySymbol}</span>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            connectionStatus === "connected" && "bg-green-500/20 text-green-400",
            connectionStatus === "connecting" && "bg-yellow-500/20 text-yellow-400",
            connectionStatus === "disconnected" && "bg-red-500/20 text-red-400",
            connectionStatus === "pre-market" && "bg-blue-500/20 text-blue-400"
          )}>
            {connectionStatus === "connected" ? "LIVE" : connectionStatus.toUpperCase().replace("-", " ")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Display */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">
              {marketData?.price.toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              }) || "-"}
            </span>
            {marketData && (
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isPositive && "text-green-400",
                isNegative && "text-red-400",
                !isPositive && !isNegative && "text-muted-foreground"
              )}>
                {isPositive && <TrendingUp className="h-4 w-4" />}
                {isNegative && <TrendingDown className="h-4 w-4" />}
                {!isPositive && !isNegative && <Minus className="h-4 w-4" />}
                <span>
                  {isPositive && "+"}
                  {marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(4)}%)
                </span>
              </div>
            )}
          </div>
          
          {/* Last Update */}
          {marketData && (
            <p className="text-xs text-muted-foreground">
              Last update: {marketData.lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Mini Volume Chart */}
        {marketData && marketData.volume.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              <span>Recent Volume</span>
            </div>
            <div className="flex items-end gap-0.5 h-8">
              {marketData.volume.map((v, i) => {
                const maxVol = Math.max(...marketData.volume);
                const height = (v / maxVol) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 bg-primary/40 rounded-sm transition-all duration-300"
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* No Data State */}
        {!marketData && connectionStatus === "disconnected" && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <p>No live data</p>
            <p className="text-xs mt-1">Connect to start streaming</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

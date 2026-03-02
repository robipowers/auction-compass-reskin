import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Target, BarChart3, CheckCircle } from "lucide-react";
import type { JournalStats } from "@/types/journal";

interface JournalStatsCardsProps {
  stats: JournalStats | undefined;
  isLoading: boolean;
}

export function JournalStatsCards({ stats, isLoading }: JournalStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-secondary/50 animate-pulse">
            <CardContent className="p-5 text-center">
              <div className="h-8 bg-muted rounded w-20 mx-auto mb-2" />
              <div className="h-3 bg-muted rounded w-16 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const pnlValue = stats?.totalPnl ?? 0;
  const items = [
    {
      label: "Net P&L",
      value: `${pnlValue >= 0 ? "+" : "-"}$${Math.abs(pnlValue).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      variant: pnlValue >= 0 ? "positive" : "negative",
      icon: pnlValue >= 0 ? TrendingUp : TrendingDown,
    },
    {
      label: "Win Rate",
      value: stats ? `${Math.round(stats.winRate)}%` : "0%",
      variant: "neutral",
      icon: Target,
    },
    {
      label: "Plan Adherence",
      value: stats ? `${Math.round(stats.planAdherence)}%` : "0%",
      variant: "neutral",
      icon: CheckCircle,
    },
    {
      label: "Total Trades",
      value: String(stats?.totalTrades ?? 0),
      variant: "neutral",
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="bg-secondary/50 border-border/50">
          <CardContent className="p-5 text-center">
            <div className="flex justify-center mb-2">
              <item.icon className={cn(
                "h-5 w-5",
                item.variant === "positive" && "text-green-400",
                item.variant === "negative" && "text-red-400",
                item.variant === "neutral" && "text-muted-foreground",
              )} />
            </div>
            <div className={cn(
              "text-3xl font-bold",
              item.variant === "positive" && "text-green-400",
              item.variant === "negative" && "text-red-400",
            )}>
              {item.value}
            </div>
            <div className="text-xs uppercase text-muted-foreground mt-1 tracking-wider">
              {item.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

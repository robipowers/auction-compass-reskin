import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Shield, AlertTriangle, BarChart3, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JournalStats } from "@/types/journal";

interface JournalInsightsProps {
  stats: JournalStats | undefined;
  isLoading: boolean;
}

const MOCK_INSIGHTS = [
  {
    id: "1",
    type: "pattern" as const,
    title: "FOMO leads to early entries",
    description: 'When you tag "FOMO" as a pre-trade emotion, you enter early 73% of the time, before proper scenario validation. This results in a 45% lower win rate.',
    confidence: 85,
    tradesAnalyzed: 12,
    period: "Last 14 days",
  },
  {
    id: "2",
    type: "pattern" as const,
    title: "Revenge trading after losses",
    description: "After a losing trade, you're 3x more likely to take another trade within 30 minutes. These revenge trades have a 68% loss rate.",
    confidence: 92,
    tradesAnalyzed: 8,
    period: "Last 30 days",
  },
  {
    id: "3",
    type: "correlation" as const,
    title: "Patient emotions = Better P&L",
    description: 'Trades where you tagged "patient" as a pre-trade emotion have an average P&L of +$215, compared to -$45 for impatient trades.',
    confidence: 88,
    tradesAnalyzed: 18,
    period: "Last 30 days",
  },
  {
    id: "4",
    type: "correlation" as const,
    title: "Plan adherence drives success",
    description: "When you follow your auction plan, your win rate is 78%. When you deviate, it drops to 42%. The difference is statistically significant.",
    confidence: 95,
    tradesAnalyzed: 24,
    period: "Last 30 days",
  },
  {
    id: "5",
    type: "strength" as const,
    title: "Excellent at scenario validation",
    description: "When you wait for proper scenario validation (acceptance + time + volume), your win rate is 82%. You're strong at recognizing valid setups.",
    confidence: 90,
    tradesAnalyzed: 15,
    period: "Last 30 days",
  },
  {
    id: "6",
    type: "weakness" as const,
    title: "Emotional discipline needs work",
    description: "Your biggest losses occur when you deviate from your plan due to emotional triggers (FOMO, revenge, anxiety). Building emotional awareness is key.",
    confidence: 87,
    tradesAnalyzed: 10,
    period: "Last 30 days",
  },
];

const typeConfig = {
  pattern: { label: "Pattern", color: "border-l-blue-500" },
  correlation: { label: "Correlation", color: "border-l-purple-500" },
  strength: { label: "Strength", color: "border-l-green-500" },
  weakness: { label: "Weakness", color: "border-l-red-500" },
};

const sectionIcons = {
  pattern: Search,
  correlation: TrendingUp,
  strength: Shield,
  weakness: AlertTriangle,
};

export function JournalInsights({ stats, isLoading }: JournalInsightsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-5">
              <div className="h-4 bg-muted rounded w-24 mb-3" />
              <div className="h-5 bg-muted rounded w-48 mb-2" />
              <div className="h-12 bg-muted rounded w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Group by type and show emotion correlations from real stats
  const sections = [
    { title: "Patterns Detected", type: "pattern" as const },
    { title: "Correlations", type: "correlation" as const },
    { title: "Strengths", type: "strength" as const },
    { title: "Areas to Improve", type: "weakness" as const },
  ];

  return (
    <div className="space-y-8">
      {/* Emotion Correlations from Real Data */}
      {stats && stats.emotionCorrelations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            Emotion-Performance Correlations
          </h3>
          <Card className="border-border/50">
            <CardContent className="p-5 space-y-3">
              <div className="text-xs text-muted-foreground mb-3">Average P&L by Emotion</div>
              {stats.emotionCorrelations
                .sort((a, b) => b.avgPnl - a.avgPnl)
                .slice(0, 8)
                .map((corr) => (
                  <div key={corr.emotion} className="flex items-center gap-3">
                    <div className="w-24 text-sm font-medium capitalize">{corr.emotion}</div>
                    <div className="flex-1 h-5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          corr.avgPnl >= 0 ? "bg-green-500/60" : "bg-red-500/60"
                        )}
                        style={{
                          width: `${Math.min(Math.abs(corr.avgPnl) / 5 + 10, 100)}%`,
                        }}
                      />
                    </div>
                    <div className={cn("w-16 text-right text-sm font-semibold", corr.avgPnl >= 0 ? "text-green-400" : "text-red-400")}>
                      {corr.avgPnl >= 0 ? "+" : ""}${corr.avgPnl.toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground w-12 text-right">{corr.frequency}x</div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Insights */}
      {sections.map((section) => {
        const insights = MOCK_INSIGHTS.filter((i) => i.type === section.type);
        if (insights.length === 0) return null;

        return (
          <div key={section.type}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {(() => { const Icon = sectionIcons[section.type]; return <Icon className="h-5 w-5 text-muted-foreground" />; })()}
              {section.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight) => {
                const config = typeConfig[insight.type];
                return (
                  <Card
                    key={insight.id}
                    className={cn(
                      "border-border/50 border-l-4 hover:shadow-md transition-all cursor-pointer",
                      config.color
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                          {config.label}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {insight.description}
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" /> {insight.tradesAnalyzed} trades</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {insight.period}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

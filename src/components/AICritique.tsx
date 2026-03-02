import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertTriangle, 
  MinusCircle, 
  Sparkles, 
  Copy, 
  Check,
  TrendingUp,
  Target,
  Shield,
  BarChart3,
  Crosshair,
  Activity
} from "lucide-react";
import { AICritique as AICritiqueType, Coherence } from "@/types/auction";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface AICritiqueProps {
  critique: AICritiqueType;
  mode?: "premarket" | "live";
}

const coherenceConfig: Record<
  Coherence,
  { icon: React.ElementType; className: string; label: string; gradient: string }
> = {
  ALIGNED: {
    icon: CheckCircle,
    className: "bg-success/15 text-success border-success/25",
    label: "Aligned",
    gradient: "from-green-500/20 to-emerald-500/10",
  },
  CONFLICTED: {
    icon: AlertTriangle,
    className: "bg-danger/15 text-danger border-danger/25",
    label: "Conflicted",
    gradient: "from-red-500/20 to-orange-500/10",
  },
  NEUTRAL: {
    icon: MinusCircle,
    className: "bg-muted text-muted-foreground border-border",
    label: "Neutral",
    gradient: "from-slate-500/20 to-slate-400/10",
  },
};

// Premium section wrapper component
function AnalysisSection({ 
  title, 
  icon: Icon,
  children, 
  variant = "default",
  className 
}: { 
  title: string; 
  icon?: React.ElementType;
  children: React.ReactNode; 
  variant?: "default" | "primary" | "warning" | "danger" | "success";
  className?: string;
}) {
  const variantStyles = {
    default: "border-border/50 bg-gradient-to-br from-secondary/40 to-secondary/20",
    primary: "border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
    warning: "border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent",
    danger: "border-red-500/30 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent",
    success: "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent",
  };

  const titleStyles = {
    default: "text-muted-foreground",
    primary: "text-primary",
    warning: "text-amber-500",
    danger: "text-red-500",
    success: "text-emerald-500",
  };

  return (
    <section className={cn(
      "relative rounded-xl border p-6 backdrop-blur-sm transition-all duration-300",
      "hover:shadow-lg hover:shadow-primary/5",
      variantStyles[variant],
      className
    )}>
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent rounded-tr-xl pointer-events-none" />
      
      <h4 className={cn(
        "mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest",
        titleStyles[variant]
      )}>
        {Icon && <Icon className="h-4 w-4" />}
        {title}
      </h4>
      {children}
    </section>
  );
}

// Strip markdown formatting from text
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

// Premium formatted text with better typography
function FormattedText({ text, className }: { text: string; className?: string }) {
  const paragraphs = text
    .split(/(?:---|\\n\\n|(?=The \\d+[\\d.-]*pip))/gi)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  if (paragraphs.length <= 1) {
    return (
      <p className={cn(
        "text-[15px] leading-[1.9] text-foreground/80 font-normal",
        className
      )}>
        {text}
      </p>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-[15px] leading-[1.9] text-foreground/80">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

// Premium scenario card - Clean vertical layout
function ScenarioCard({ scenario, index }: { scenario: AICritiqueType['scenarios'][0]; index: number }) {
  return (
    <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card to-secondary/20 p-6 transition-all hover:border-primary/30 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-base font-bold text-white shadow-lg shadow-primary/25">
          {index + 1}
        </span>
        <h4 className="font-bold text-xl text-foreground leading-tight pt-1">
          {stripMarkdown(scenario.name)}
        </h4>
      </div>
      
      {/* Key Details - Simple stacked layout */}
      <div className="space-y-3 mb-5">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide w-20 shrink-0">Type</span>
          <span className="text-sm text-foreground">{stripMarkdown(scenario.typeOfMove)}</span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-semibold text-blue-400 uppercase tracking-wide w-20 shrink-0">In Play</span>
          <span className="text-sm text-foreground">{stripMarkdown(scenario.inPlay)}</span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-semibold text-red-400 uppercase tracking-wide w-20 shrink-0">LIS</span>
          <span className="text-sm text-foreground">{stripMarkdown(scenario.lis)}</span>
        </div>
      </div>
      
      {/* Behavior - Full width */}
      {scenario.behavior && (
        <div className="rounded-lg bg-secondary/50 border border-border/30 p-4">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Behavior</p>
          <p className="text-sm leading-relaxed text-foreground/90">
            {stripMarkdown(scenario.behavior)}
          </p>
        </div>
      )}
    </div>
  );
}

export function AICritique({ critique, mode = "premarket" }: AICritiqueProps) {
  const [copied, setCopied] = useState(false);
  const coherence = coherenceConfig[critique.coherence];
  const CoherenceIcon = coherence.icon;
  const isLiveMode = mode === "live";

  const formatCritiqueForCopy = () => {
    const lines = [
      "AI STRATEGIST ANALYSIS",
      "=".repeat(50),
      "",
    ];

    if (critique.currentAuctionState) {
      lines.push(
        "CURRENT AUCTION STATE",
        "-".repeat(30),
        "STATE: " + critique.currentAuctionState.state,
        "EXPLANATION: " + critique.currentAuctionState.explanation,
        ""
      );
    }

    lines.push(
      "COHERENCE: " + coherence.label,
      critique.coherenceExplanation,
      "",
      "STRUCTURAL OBSERVATIONS",
      "-".repeat(30),
      critique.structuralObservations,
      "",
      "KEY STRUCTURAL SCENARIOS",
      "-".repeat(30),
      ...critique.scenarios.map((s, i) => 
        (i + 1) + ". " + s.name + "\n   Type: " + s.typeOfMove + "\n   In Play: " + s.inPlay + "\n   LIS: " + s.lis + (s.behavior ? "\n   Behavior: " + s.behavior : "")
      ),
      "",
    );

    if (critique.inventoryRiskAnalysis?.trim()) {
      lines.push("INVENTORY RISK ANALYSIS", "-".repeat(30), critique.inventoryRiskAnalysis, "");
    }

    lines.push(
      "PRIMARY RISK",
      "-".repeat(30),
      critique.primaryRisk,
      "",
      "MARKET CONTEXT",
      "-".repeat(30),
      critique.marketContext,
      "",
      "STRUCTURAL CHECKLIST",
      "-".repeat(30),
      ...critique.dailyChecklist.map((item, i) => (i + 1) + ". Q: " + item.question + "\n   A: " + item.answer)
    );

    return lines.join("\n");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatCritiqueForCopy());
      setCopied(true);
      toast.success("Analysis copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  // In Live mode, show only execution-critical sections
  if (isLiveMode) {
    return (
      <Card className="relative overflow-hidden border-2 border-accent/30 bg-gradient-to-br from-background via-background to-accent/5 shadow-xl shadow-accent/10 animate-fade-in">
        {/* Premium header glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-accent/20 to-transparent blur-3xl pointer-events-none" />
        
        <CardHeader className="relative pb-6">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/70 shadow-xl shadow-accent/30">
                <Sparkles className="h-6 w-6 text-white" />
              </span>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">Execution Summary</span>
                <span className="text-sm text-muted-foreground">What matters right now</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative space-y-6">
          {/* Primary Risk - Always visible */}
          <AnalysisSection title="Primary Risk" icon={AlertTriangle} variant="danger">
            <FormattedText text={critique.primaryRisk} />
          </AnalysisSection>

          {/* What Must Happen Next */}
          <AnalysisSection title="What Must Happen Next" icon={Target} variant="primary">
            <div className="space-y-3">
              {critique.scenarios.map((scenario, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg bg-background/50 p-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{scenario.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium text-blue-400">In Play:</span> {stripMarkdown(scenario.inPlay)} • 
                      <span className="font-medium text-red-400 ml-2">LIS:</span> {stripMarkdown(scenario.lis)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnalysisSection>

          {/* Current Auction State - Compact */}
          {critique.currentAuctionState && (
            <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current State</span>
                <Badge className="bg-primary/20 text-primary border-primary/30 font-bold">
                  {critique.currentAuctionState.state}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Full Premarket mode - show everything with premium styling
  return (
    <Card className="relative overflow-hidden border-2 border-purple-500/30 bg-gradient-to-br from-background via-background to-purple-500/5 shadow-xl shadow-purple-500/10 animate-fade-in">
      {/* Premium header glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-purple-500/20 to-transparent blur-3xl pointer-events-none" />
      
      <CardHeader className="relative pb-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-xl shadow-purple-500/30">
              <Sparkles className="h-6 w-6 text-white" />
            </span>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">AI Strategist Analysis</span>
              <span className="text-sm text-muted-foreground">Full structural context</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2 border-border/50 hover:bg-secondary/50"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        {/* Current Auction State */}
        {critique.currentAuctionState && (
          <AnalysisSection title="Current Auction State" icon={Activity} variant="primary">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">State</span>
              <Badge className="bg-primary/20 text-primary border-primary/30 font-bold px-3 py-1">
                {critique.currentAuctionState.state}
              </Badge>
            </div>
            <FormattedText text={critique.currentAuctionState.explanation} />
          </AnalysisSection>
        )}

        {/* Coherence Analysis */}
        <AnalysisSection 
          title="Coherence Analysis" 
          icon={CoherenceIcon}
          className={cn("bg-gradient-to-br", coherence.gradient)}
        >
          <div className="flex items-center gap-2 mb-4">
            <Badge
              variant="outline"
              className={cn("gap-1.5 px-3 py-1.5 font-bold text-sm", coherence.className)}
            >
              <CoherenceIcon className="h-4 w-4" />
              {coherence.label}
            </Badge>
          </div>
          <FormattedText text={critique.coherenceExplanation} />
        </AnalysisSection>

        {/* Structural Observations */}
        <AnalysisSection title="Structural Observations" icon={BarChart3}>
          <FormattedText text={critique.structuralObservations} />
        </AnalysisSection>

        {/* Key Structural Scenarios - Premium Table */}
        <AnalysisSection title="Key Structural Scenarios" icon={Target}>
          <div className="overflow-hidden rounded-xl border border-border/50">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-secondary/80 to-secondary/60">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-foreground">Scenario</th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-foreground">Type of Move</th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-foreground">In Play</th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-foreground">LIS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {critique.scenarios.map((scenario, index) => (
                  <tr key={index} className="transition-colors hover:bg-secondary/30 group">
                    <td className="px-5 py-4 font-semibold text-foreground group-hover:text-primary transition-colors">{scenario.name}</td>
                    <td className="px-5 py-4 text-muted-foreground">{stripMarkdown(scenario.typeOfMove)}</td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-blue-400">{stripMarkdown(scenario.inPlay)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-red-400">{stripMarkdown(scenario.lis)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnalysisSection>

        {/* Suggested Strategy */}
        <AnalysisSection title="Suggested Strategy" icon={TrendingUp}>
          <div className="grid gap-4 lg:grid-cols-2">
            {critique.scenarios.map((scenario, index) => (
              <ScenarioCard key={index} scenario={scenario} index={index} />
            ))}
          </div>
        </AnalysisSection>

        {/* Inventory Risk Analysis */}
        {critique.inventoryRiskAnalysis && critique.inventoryRiskAnalysis.trim().length > 0 && (
          <AnalysisSection title="Inventory Risk Analysis" icon={Shield} variant="warning">
            <FormattedText text={critique.inventoryRiskAnalysis} />
          </AnalysisSection>
        )}

        {/* Primary Risk */}
        <AnalysisSection title="Primary Risk" icon={AlertTriangle} variant="danger">
          <FormattedText text={critique.primaryRisk} />
        </AnalysisSection>

        {/* Market Context */}
        <AnalysisSection title="Market Context" icon={BarChart3}>
          <FormattedText text={critique.marketContext} />
        </AnalysisSection>

        {/* Structural Checklist Q&A */}
        <AnalysisSection title="Structural Checklist">
          <div className="space-y-4">
            {critique.dailyChecklist.map((item, index) => (
              <div
                key={index}
                className="group rounded-xl border border-border/50 bg-gradient-to-r from-card to-secondary/20 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <p className="font-semibold text-foreground leading-relaxed pt-1">
                      {item.question}
                    </p>
                  </div>
                </div>
                <div className="border-t border-border/50 bg-secondary/30 p-5">
                  <p className="text-sm leading-relaxed text-foreground/80 pl-11">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AnalysisSection>
      </CardContent>
    </Card>
  );
}

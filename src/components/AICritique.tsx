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
    lines.push("COHERENCE: " + coherence.label);
    lines.push(critique.coherenceExplanation);
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

  return (
    <Card className="relative overflow-hidden border-2 border-accent/30 bg-gradient-to-br from-background via-background to-accent/5 shadow-xl shadow-accent/10 animate-fade-in">
      <CardHeader className="relative pb-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/70 shadow-xl shadow-accent/30">
              <Sparkles className="h-6 w-6 text-white" />
            </span>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">AI Strategist Analysis</span>
              <span className="text-sm text-muted-foreground">Institutional AMT Framework</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        <AnalysisSection title="Primary Risk" icon={AlertTriangle} variant="danger">
          <p className="text-sm text-foreground/80">{critique.primaryRisk}</p>
        </AnalysisSection>
      </CardContent>
    </Card>
  );
}

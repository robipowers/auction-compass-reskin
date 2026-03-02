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
    warning: "border-warning/30 bg-gradient-to-br from-warning/10 via-warning/5 to-transparent",
    danger: "border-danger/30 bg-gradient-to-br from-danger/10 via-danger/5 to-transparent",
    success: "border-success/30 bg-gradient-to-br from-success/10 via-success/5 to-transparent",
  };
  
  return (
    <div className={cn("rounded-xl border p-4", variantStyles[variant], className)}>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="h-4 w-4 opacity-70" />}
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      </div>
      {children}
    </div>
  );
}

export function AICritique({ critique, mode = "premarket" }: AICritiqueProps) {
  const [copied, setCopied] = useState(false);
  const CoherenceIcon = coherenceConfig[critique.coherence].icon;
  
  const handleCopy = async () => {
    const text = [
      `Overall Coherence: ${critique.coherence}`,
      `\nSummary: ${critique.summary}`,
      critique.narrative_coherence ? `\nNarrative Coherence: ${critique.narrative_coherence}` : '',
      critique.entry_trigger_alignment ? `\nEntry Trigger: ${critique.entry_trigger_alignment}` : '',
      critique.risk_reward_assessment ? `\nRisk/Reward: ${critique.risk_reward_assessment}` : '',
      `\nStrengths:\n${critique.strengths.map(s => `• ${s}`).join('\n')}`,
      `\nWeaknesses:\n${critique.weaknesses.map(w => `• ${w}`).join('\n')}`,
      `\nSuggestions:\n${critique.suggestions.map(s => `• ${s}`).join('\n')}`,
    ].filter(Boolean).join('');
    
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Analysis copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card className="border-border/50 bg-gradient-to-br from-background to-secondary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline"
              className={cn(
                "text-xs px-2 py-1 font-medium border",
                coherenceConfig[critique.coherence].className
              )}
            >
              <CoherenceIcon className="h-3 w-3 mr-1" />
              {coherenceConfig[critique.coherence].label}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopy}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Summary */}
        <AnalysisSection title="Assessment" icon={Activity}>
          <p className="text-sm text-foreground/90 leading-relaxed">{critique.summary}</p>
        </AnalysisSection>

        {/* Premium fields - narrative coherence */}
        {critique.narrative_coherence && (
          <AnalysisSection 
            title="Narrative Coherence" 
            icon={TrendingUp}
            variant={critique.coherence === 'ALIGNED' ? 'success' : critique.coherence === 'CONFLICTED' ? 'danger' : 'default'}
          >
            <p className="text-sm text-foreground/90 leading-relaxed">{critique.narrative_coherence}</p>
          </AnalysisSection>
        )}
        
        {/* Entry trigger alignment */}
        {critique.entry_trigger_alignment && (
          <AnalysisSection title="Entry Trigger Alignment" icon={Crosshair} variant="primary">
            <p className="text-sm text-foreground/90 leading-relaxed">{critique.entry_trigger_alignment}</p>
          </AnalysisSection>
        )}
        
        {/* Risk/reward */}
        {critique.risk_reward_assessment && (
          <AnalysisSection title="Risk / Reward Assessment" icon={BarChart3}>
            <p className="text-sm text-foreground/90 leading-relaxed">{critique.risk_reward_assessment}</p>
          </AnalysisSection>
        )}

        {/* Strengths / Weaknesses grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {critique.strengths.length > 0 && (
            <AnalysisSection title="Strengths" icon={Target} variant="success">
              <ul className="space-y-1.5">
                {critique.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-3.5 w-3.5 mt-0.5 text-success shrink-0" />
                    <span className="text-foreground/85">{strength}</span>
                  </li>
                ))}
              </ul>
            </AnalysisSection>
          )}
          
          {critique.weaknesses.length > 0 && (
            <AnalysisSection title="Weaknesses" icon={Shield} variant="danger">
              <ul className="space-y-1.5">
                {critique.weaknesses.map((weakness, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-danger shrink-0" />
                    <span className="text-foreground/85">{weakness}</span>
                  </li>
                ))}
              </ul>
            </AnalysisSection>
          )}
        </div>

        {/* Suggestions */}
        {critique.suggestions.length > 0 && (
          <AnalysisSection title="Recommendations" icon={Sparkles} variant="primary">
            <ul className="space-y-1.5">
              {critique.suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary font-bold mt-0.5 shrink-0">{i + 1}.</span>
                  <span className="text-foreground/85">{suggestion}</span>
                </li>
              ))}
            </ul>
          </AnalysisSection>
        )}
      </CardContent>
    </Card>
  );
}
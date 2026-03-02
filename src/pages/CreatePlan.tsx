import { useState } from "react";
import { AuctionPlanForm } from "@/components/AuctionPlanForm";
import { ScenarioValidationTracker } from "@/components/ScenarioValidationTracker";
import { TradingCoach } from "@/components/TradingCoach";
import { AICritique } from "@/components/AICritique";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Download, Loader2 } from "lucide-react";
import { ExecutionModeProvider, useExecutionMode } from "@/contexts/ExecutionModeContext";
import { ExecutionModeToggle } from "@/components/ExecutionModeToggle";
import {
  YesterdayContext,
  TodayContext,
  ReferenceLevels,
  AuctionPlan,
  AICritique as AICritiqueType,
  CoachMessage,
  Scenario,
  ScenarioValidation,
  ValidationStatus,
} from "@/types/auction";

function CreatePlanContent() {
  const { toast } = useToast();
  const { isPremarket, isLive } = useExecutionMode();
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plan, setPlan] = useState<AuctionPlan | null>(null);
  const [critique, setCritique] = useState<AICritiqueType | null>(null);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [validations, setValidations] = useState<ScenarioValidation[]>([]);
  const [previousValidations, setPreviousValidations] = useState<ScenarioValidation[] | undefined>();
  const [isCoachLoading, setIsCoachLoading] = useState(false);
  const [showContextInLive, setShowContextInLive] = useState(false);

  // Create initial validations from scenarios
  const createInitialValidations = (scenarios: Scenario[]): ScenarioValidation[] => {
    return scenarios.map((scenario) => ({
      status: "in_play" as ValidationStatus,
      validatedConditions: [],
      pendingConditions: ["Requires acceptance (time + volume)", `Watch for activity at ${scenario.inPlay}`],
      invalidationCondition: `Acceptance ${scenario.lis}`,
    }));
  };

  const handleSavePlan = async (data: {
    yesterday: YesterdayContext;
    today: TodayContext;
    levels: ReferenceLevels;
  }) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newPlan: AuctionPlan = {
        id: Date.now().toString(),
        instrument: "EURUSD",
        yesterday: data.yesterday,
        today: data.today,
        levels: data.levels,
        createdAt: new Date(),
      };

      setPlan(newPlan);
      toast({
        title: "Plan Saved",
        description: "Your auction plan has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyzePlan = async () => {
    if (!plan) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-strategist', {
        body: { plan }
      });

      if (error) {
        console.error('AI Strategist error:', error);
        throw new Error(error.message || 'Failed to analyze plan');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const critiqueData: AICritiqueType = {
        id: Date.now().toString(),
        planId: plan.id,
        currentAuctionState: data.currentAuctionState,
        coherence: data.coherence,
        coherenceExplanation: data.coherenceExplanation,
        structuralObservations: data.structuralObservations,
        scenarios: data.scenarios,
        inventoryRiskAnalysis: data.inventoryRiskAnalysis,
        primaryRisk: data.primaryRisk,
        marketContext: data.marketContext,
        dailyChecklist: data.dailyChecklist,
        createdAt: new Date(),
      };

      setCritique(critiqueData);
      setValidations(createInitialValidations(data.scenarios));
      toast({
        title: "Analysis Complete",
        description: "AI Strategist has generated your structural critique.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Parse validation data from AI response - handles both scenario1/2/3 keys and scenario name keys
  const parseValidationsFromResponse = (content: string, scenarios: Scenario[]): ScenarioValidation[] | null => {
    try {
      // Extract JSON using brace-counting to handle nested objects
      const tagStart = content.search(/\[VALIDATIONS:\s*\{/i);
      if (tagStart === -1) return null;

      const jsonStart = content.indexOf('{', tagStart);
      if (jsonStart === -1) return null;

      // Count braces to find matching close
      let braceCount = 0;
      let jsonEnd = -1;
      for (let i = jsonStart; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        if (content[i] === '}') braceCount--;
        if (braceCount === 0) {
          jsonEnd = i + 1;
          break;
        }
      }

      if (jsonEnd <= jsonStart) return null;

      const rawJson = content.substring(jsonStart, jsonEnd);
      console.log('Client parsing validation JSON:', rawJson.substring(0, 200));
      
      const validationData = JSON.parse(rawJson);
      const keys = Object.keys(validationData);
      console.log('Validation keys:', keys);
      
      return scenarios.map((scenario, index) => {
        // Try multiple key formats
        const numericKey = `scenario${index + 1}`;
        const scenarioName = scenario.name || '';
        
        let data = validationData[numericKey];
        
        // Try exact name match
        if (!data && scenarioName) {
          data = validationData[scenarioName];
        }
        
        // Try partial name match
        if (!data && scenarioName) {
          const scenarioWords = scenarioName.toLowerCase().split(/\s+/).filter(w => w.length > 4);
          for (const key of keys) {
            const keyLower = key.toLowerCase();
            const matchCount = scenarioWords.filter(word => keyLower.includes(word)).length;
            if (matchCount >= 2 || keyLower.includes(scenarioName.toLowerCase().substring(0, 20))) {
              data = validationData[key];
              break;
            }
          }
        }
        
        // Positional match fallback
        if (!data && keys.length === scenarios.length) {
          data = validationData[keys[index]];
        }
        
        if (!data) data = {};

        const parseStatus = (s: string): ValidationStatus => {
          const normalized = s.toLowerCase().replace(/[\s_-]+/g, '_');
          if (normalized.includes('inactive')) return "inactive";
          if (normalized.includes('in_play') || normalized === 'in play') return "in_play";
          if (normalized.includes('invalidated')) return "invalidated";
          if (normalized === 'validated' || normalized === 'confirmed') return "validated";
          if (normalized.includes('partially') || normalized.includes('partial')) return "partially_validated";
          // Legacy "not_validated" maps to "in_play"
          if (normalized.includes('not_validated') || normalized === 'not validated') return "in_play";
          return "in_play";
        };
        
        return {
          status: parseStatus(data.status || "in_play"),
          validatedConditions: data.validatedConditions || [],
          pendingConditions: data.pendingConditions || ["Awaiting price action update"],
          invalidationCondition: data.invalidationCondition || scenario.lis,
        };
      });
    } catch (e) {
      console.warn('Failed to parse validations from response:', e);
      return null;
    }
  };

  // Strip validation tag from displayed content
  const stripValidationTag = (content: string): string => {
    return content.replace(/\[VALIDATIONS:\s*\{[\s\S]*?\}\s*\]/gi, '').trim();
  };

  const handleSendMessage = async (content: string) => {
    if (!critique || !plan) return;

    const userMessage: CoachMessage = {
      id: Date.now().toString(),
      planId: plan.id,
      role: "user",
      content,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsCoachLoading(true);

    try {
      // Build chat history for context (exclude current message)
      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      // Call the real AI edge function with current validations for context
      const { data, error } = await supabase.functions.invoke('trading-coach', {
        body: {
          message: content,
          planContext: {
            yesterday: plan.yesterday,
            today: plan.today,
            levels: plan.levels
          },
          scenarios: critique.scenarios,
          chatHistory,
          currentValidations: validations
        }
      });

      if (error) {
        console.error('Trading Coach error:', error);
        throw new Error(error.message || 'Failed to get coach response');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const responseContent = data?.content || '';
      
      // Parse new validations from response
      const newValidations = parseValidationsFromResponse(responseContent, critique.scenarios);
      if (newValidations) {
        setPreviousValidations([...validations]);
        setValidations(newValidations);
      } else if (data?.validations) {
        // Fallback to validations from response data
        setPreviousValidations([...validations]);
        setValidations(data.validations);
      }
      
      // Strip validation tag from displayed content
      const displayContent = stripValidationTag(responseContent);

      const assistantMessage: CoachMessage = {
        id: (Date.now() + 1).toString(),
        planId: plan.id,
        role: "assistant",
        content: displayContent,
        validationStates: newValidations ? 
          [newValidations[0].status, newValidations[1].status, newValidations[2].status] :
          undefined,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Coach error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get coach response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCoachLoading(false);
    }
  };

  const handleExportReport = () => {
    const report = generateMarkdownReport();
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auction-plan-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "Your daily trading journal has been downloaded.",
    });
  };

  const generateMarkdownReport = () => {
    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let report = `# Auction Plan Report\n\n`;
    report += `**Date:** ${date}\n`;
    report += `**Instrument:** ${plan?.instrument || "EURUSD"}\n\n`;

    if (plan) {
      report += `## Yesterday's Context\n\n`;
      report += `- **Day Type:** ${plan.yesterday.dayType}\n`;
      report += `- **Value Relationship:** ${plan.yesterday.valueRelationship}\n`;
      report += `- **Structure:** ${plan.yesterday.structure}\n`;
      report += `- **Prominent VPOC:** ${plan.yesterday.prominentVpoc}\n\n`;

      report += `## Today's Context\n\n`;
      report += `- **Inventory:** ${plan.today.inventory}\n`;
      report += `- **Open Relation:** ${plan.today.openRelation}\n\n`;

      report += `## Reference Levels\n\n`;
      report += `- **Overnight High:** ${plan.levels.overnightHigh}\n`;
      report += `- **Overnight Low:** ${plan.levels.overnightLow}\n`;
      report += `- **Yesterday VAH:** ${plan.levels.yesterdayVah}\n`;
      report += `- **Yesterday VAL:** ${plan.levels.yesterdayVal}\n\n`;
    }

    if (critique) {
      report += `## AI Analysis\n\n`;
      report += `### Coherence: ${critique.coherence}\n\n`;
      report += `${critique.coherenceExplanation}\n\n`;

      report += `### Scenarios\n\n`;
      critique.scenarios.forEach((s, i) => {
        const validation = validations[i];
        report += `**${i + 1}. ${s.name}**\n`;
        report += `- Status: ${validation?.status.toUpperCase().replace('_', ' ') || 'NOT VALIDATED'}\n`;
        report += `- Type: ${s.typeOfMove}\n`;
        report += `- In Play: ${s.inPlay}\n`;
        report += `- LIS: ${s.lis}\n`;
        if (validation?.validatedConditions.length) {
          report += `- Validated: ${validation.validatedConditions.join(', ')}\n`;
        }
        if (validation?.pendingConditions.length) {
          report += `- Pending: ${validation.pendingConditions.join(', ')}\n`;
        }
        report += `\n`;
      });

      report += `### Primary Risk\n\n${critique.primaryRisk}\n\n`;
    }

    if (messages.length > 0) {
      report += `## Trading Coach Session\n\n`;
      messages.forEach((m) => {
        const time = m.createdAt.toLocaleTimeString();
        report += `**[${time}] ${m.role === "user" ? "Trader" : "Coach"}:**\n`;
        report += `${m.content}\n\n`;
      });
    }

    report += `---\n\n## Post-Session Notes\n\n`;
    report += `*Add your observations here after the session...*\n`;

    return report;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl py-8 lg:py-12">
        {/* Page Header with Mode Toggle */}
        <header className="mb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Create Auction Plan
              </h1>
              <p className="mt-2 text-muted-foreground text-base">
                Build your pre-market analysis for EURUSD
              </p>
            </div>
            {critique && <ExecutionModeToggle />}
          </div>
        </header>

        {/* Mode Labels */}
        {critique && (
          <div className="mb-8 rounded-xl border border-border bg-secondary/30 p-4">
            {isPremarket ? (
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-foreground">
                  Premarket Preparation – Context & Structure
                </span>
                <span className="text-xs text-muted-foreground">
                  Full analysis for building conviction before the session
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm font-medium text-foreground">
                  Live Execution – Conditions & Validation
                </span>
                <span className="text-xs text-muted-foreground">
                  Execution-critical elements only • Discipline & patience
                </span>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-10 xl:grid-cols-2">
          {/* Left Column - Form and Analysis */}
          <div className="space-y-8">
            {/* Always show form */}
            <AuctionPlanForm onSave={handleSavePlan} isLoading={isSaving} />

            {plan && !critique && (
              <div className="flex justify-center py-4">
                <Button
                  variant="hero"
                  size="xl"
                  onClick={handleAnalyzePlan}
                  disabled={isAnalyzing}
                  className="min-w-[260px]"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Analyze with AI Strategist
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* AI Critique - Full in Premarket, Collapsible in Live */}
            {critique && (
              <>
                {isPremarket ? (
                  <AICritique critique={critique} />
                ) : (
                  <div className="space-y-4">
                    {/* Primary Risk - Always visible in Live mode */}
                    <AICritique critique={critique} mode="live" />
                    
                    {/* View Context Toggle */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowContextInLive(!showContextInLive)}
                      className="w-full"
                    >
                      {showContextInLive ? "Hide Context" : "View Full Context"}
                    </Button>
                    
                    {showContextInLive && (
                      <div className="animate-fade-in">
                        <AICritique critique={critique} mode="premarket" />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column - Validation Tracker and Coach */}
          <div className="space-y-8">
            {critique && (
              <>
                <div className="flex justify-end">
                  <Button variant="outline" size="default" onClick={handleExportReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>

                {/* Scenario Validation Tracker - Always visible */}
                <ScenarioValidationTracker
                  scenarios={critique.scenarios}
                  validations={validations}
                  previousValidations={previousValidations}
                />

                {/* Trading Coach - Only active in Live mode, disabled in Premarket */}
                <TradingCoach
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isCoachLoading}
                  disabled={isPremarket}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreatePlan() {
  return (
    <ExecutionModeProvider>
      <CreatePlanContent />
    </ExecutionModeProvider>
  );
}

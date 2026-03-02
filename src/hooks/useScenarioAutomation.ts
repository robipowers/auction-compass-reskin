import { useState, useEffect, useCallback, useRef } from "react";
import { useMacroPlan } from "@/hooks/use-plans";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type AutomationState = "idle" | "running" | "paused" | "completed";

interface AutomationStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "error";
  result?: string;
}

interface UseScenarioAutomationReturn {
  state: AutomationState;
  steps: AutomationStep[];
  currentStep: number;
  progress: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  error: string | null;
}

const AUTOMATION_STEPS: Omit<AutomationStep, "status">[] = [
  { id: "validate-context", name: "Validating market context" },
  { id: "check-inventory", name: "Analyzing inventory levels" },
  { id: "identify-levels", name: "Identifying key reference levels" },
  { id: "generate-scenarios", name: "Generating scenario hypotheses" },
  { id: "assign-probabilities", name: "Assigning initial probabilities" },
  { id: "validate-scenarios", name: "Cross-validating scenarios" },
  { id: "finalize", name: "Finalizing analysis" },
];

export function useScenarioAutomation(
  planId: string | null
): UseScenarioAutomationReturn {
  const [state, setState] = useState<AutomationState>("idle");
  const [steps, setSteps] = useState<AutomationStep[]>(
    AUTOMATION_STEPS.map((s) => ({ ...s, status: "pending" }))
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const pauseRef = useRef(false);
  const { toast } = useToast();

  const updateStep = useCallback(
    (stepId: string, status: AutomationStep["status"], result?: string) => {
      setSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, status, result } : s))
      );
    },
    []
  );

  const runStep = useCallback(
    async (stepIndex: number): Promise<boolean> => {
      if (pauseRef.current) return false;

      const step = AUTOMATION_STEPS[stepIndex];
      updateStep(step.id, "running");

      // Simulate async work with random delay
      await new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 1200)
      );

      if (pauseRef.current) {
        updateStep(step.id, "pending");
        return false;
      }

      // 5% chance of error for demo purposes
      if (Math.random() < 0.02) {
        updateStep(step.id, "error", "Unexpected market condition detected");
        return false;
      }

      updateStep(step.id, "completed", getStepResult(step.id));
      return true;
    },
    [updateStep]
  );

  const start = useCallback(async () => {
    if (state !== "idle") return;

    setState("running");
    pauseRef.current = false;
    setError(null);

    for (let i = 0; i < AUTOMATION_STEPS.length; i++) {
      setCurrentStep(i);
      const success = await runStep(i);

      if (!success) {
        if (pauseRef.current) {
          setState("paused");
        } else {
          setState("idle");
          setError(`Failed at step: ${AUTOMATION_STEPS[i].name}`);
          toast({
            title: "Automation Failed",
            description: `Error at: ${AUTOMATION_STEPS[i].name}`,
            variant: "destructive",
          });
        }
        return;
      }
    }

    setState("completed");
    setCurrentStep(AUTOMATION_STEPS.length);
    toast({
      title: "Analysis Complete",
      description: "Scenario automation finished successfully",
    });
  }, [state, runStep, toast]);

  const pause = useCallback(() => {
    if (state === "running") {
      pauseRef.current = true;
    }
  }, [state]);

  const resume = useCallback(async () => {
    if (state !== "paused") return;

    pauseRef.current = false;
    setState("running");

    for (let i = currentStep; i < AUTOMATION_STEPS.length; i++) {
      setCurrentStep(i);
      const success = await runStep(i);

      if (!success) {
        if (pauseRef.current) {
          setState("paused");
        } else {
          setState("idle");
          setError(`Failed at step: ${AUTOMATION_STEPS[i].name}`);
        }
        return;
      }
    }

    setState("completed");
  }, [state, currentStep, runStep]);

  const reset = useCallback(() => {
    pauseRef.current = false;
    setState("idle");
    setCurrentStep(0);
    setError(null);
    setSteps(AUTOMATION_STEPS.map((s) => ({ ...s, status: "pending" })));
  }, []);

  const progress =
    state === "completed"
      ? 100
      : Math.round((currentStep / AUTOMATION_STEPS.length) * 100);

  return { state, steps, currentStep, progress, start, pause, resume, reset, error };
}

function getStepResult(stepId: string): string {
  const results: Record<string, string> = {
    "validate-context": "Trend: Upward bias, balanced market",
    "check-inventory": "Long inventory, responsive sellers likely",
    "identify-levels": "POC: 18,420 | VAH: 18,450 | VAL: 18,390",
    "generate-scenarios": "3 scenarios generated",
    "assign-probabilities": "Bullish: 45%, Bearish: 35%, Balanced: 20%",
    "validate-scenarios": "All scenarios validated",
    "finalize": "Analysis ready for review",
  };
  return results[stepId] || "Completed";
}

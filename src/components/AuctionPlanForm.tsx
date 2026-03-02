import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Wand2, Plus, Trash2, Target, AlertTriangle, Lightbulb } from "lucide-react";

interface Scenario { id: string; label: string; trigger: string; targets: string; stop: string; probability: number; }
interface PlanFormData {
  context: string;
  structure: "coherent" | "divergent" | "transitioning";
  keyLevels: { price: string; type: "support" | "resistance" | "value_area" | "poc" }[];
  scenarios: Scenario[];
  bias: "bullish" | "bearish" | "neutral";
  notes: string;
}

const defaultScenario = (): Scenario => ({ id: Date.now().toString(), label: "", trigger: "", targets: "", stop: "", probability: 33 });

export function AuctionPlanForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PlanFormData>({
    context: "", structure: "coherent", keyLevels: [], scenarios: [defaultScenario()], bias: "neutral", notes: "",
  });
  const [aiLoading, setAiLoading] = useState(false);

  const addScenario = () => setFormData((prev) => ({ ...prev, scenarios: [...prev.scenarios, defaultScenario()] }));
  const removeScenario = (id: string) => setFormData((prev) => ({ ...prev, scenarios: prev.scenarios.filter((s) => s.id !== id) }));
  const updateScenario = (id: string, field: keyof Scenario, value: string | number) =>
    setFormData((prev) => ({ ...prev, scenarios: prev.scenarios.map((s) => s.id === id ? { ...s, [field]: value } : s) }));
  const addKeyLevel = () => setFormData((prev) => ({ ...prev, keyLevels: [...prev.keyLevels, { price: "", type: "support" }] }));
  const removeKeyLevel = (index: number) => setFormData((prev) => ({ ...prev, keyLevels: prev.keyLevels.filter((_, i) => i !== index) }));

  const handleAIAssist = async () => {
    setAiLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setFormData((prev) => ({
      ...prev,
      context: prev.context || "Balanced profile developing after yesterday's initiative move higher. Market opened within value, suggesting possible two-sided trade or range development. Key references: POC at 18,420, VAH at 18,450, VAL at 18,380.",
      scenarios: [
        { id: "ai-a", label: "Scenario A: Acceptance Higher", trigger: "Break and close above VAH (18,450) with responsive buying", targets: "18,500 → 18,540 (prior highs)", stop: "Back below 18,430", probability: 40 },
        { id: "ai-b", label: "Scenario B: Range Development", trigger: "Rotation between VAH and VAL, no trend emergence", targets: "Fade extremes of range", stop: "Break outside range with acceptance", probability: 40 },
        { id: "ai-c", label: "Scenario C: Rejection / Reversal", trigger: "Rejection at VAH, break below POC with initiative selling", targets: "18,350 → 18,300", stop: "Reclaim above 18,420", probability: 20 },
      ],
    }));
    setAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); navigate("/"); };
  const totalProbability = formData.scenarios.reduce((sum, s) => sum + s.probability, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Market Context</Label>
          <Button type="button" variant="outline" size="sm" onClick={handleAIAssist} disabled={aiLoading}>
            <Wand2 className={cn("h-3.5 w-3.5 mr-1.5", aiLoading && "animate-spin")} />{aiLoading ? "Analyzing..." : "AI Assist"}
          </Button>
        </div>
        <Textarea placeholder="Describe the current market structure, key levels, and overnight context..." value={formData.context} onChange={(e) => setFormData((prev) => ({ ...prev, context: e.target.value }))} className="min-h-[120px]" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Market Structure</Label>
          <Select value={formData.structure} onValueChange={(value) => setFormData((prev) => ({ ...prev, structure: value as any }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="coherent">Coherent</SelectItem>
              <SelectItem value="divergent">Divergent</SelectItem>
              <SelectItem value="transitioning">Transitioning</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Market Bias</Label>
          <Select value={formData.bias} onValueChange={(value) => setFormData((prev) => ({ ...prev, bias: value as any }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bullish">Bullish</SelectItem>
              <SelectItem value="bearish">Bearish</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Key Levels</Label>
          <Button type="button" variant="outline" size="sm" onClick={addKeyLevel}><Plus className="h-3.5 w-3.5 mr-1.5" />Add Level</Button>
        </div>
        <div className="space-y-2">
          {formData.keyLevels.map((level, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input type="number" placeholder="Price" value={level.price}
                onChange={(e) => { const newLevels = [...formData.keyLevels]; newLevels[index].price = e.target.value; setFormData((prev) => ({ ...prev, keyLevels: newLevels })); }}
                className="flex h-9 w-32 rounded-md border border-input bg-transparent px-3 py-1 text-sm" />
              <Select value={level.type} onValueChange={(value) => { const newLevels = [...formData.keyLevels]; newLevels[index].type = value as any; setFormData((prev) => ({ ...prev, keyLevels: newLevels })); }}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="resistance">Resistance</SelectItem>
                  <SelectItem value="value_area">Value Area</SelectItem>
                  <SelectItem value="poc">POC</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeKeyLevel(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold">Scenarios</Label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">Total probability:</span>
              <Badge variant="outline" className={cn(totalProbability === 100 ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-amber-500/20 text-amber-400 border-amber-500/50")}>{totalProbability}%</Badge>
              {totalProbability !== 100 && <span className="text-xs text-amber-400 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Should sum to 100%</span>}
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addScenario}><Plus className="h-3.5 w-3.5 mr-1.5" />Add Scenario</Button>
        </div>
        <div className="space-y-4">
          {formData.scenarios.map((scenario, index) => (
            <div key={scenario.id} className="p-4 rounded-lg border border-border bg-secondary/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Target className="h-4 w-4 text-primary" /><span className="font-medium text-sm">Scenario {String.fromCharCode(65 + index)}</span></div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeScenario(scenario.id)} disabled={formData.scenarios.length === 1}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
              <div className="grid gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Label</Label>
                  <input type="text" placeholder="e.g., Acceptance Higher" value={scenario.label} onChange={(e) => updateScenario(scenario.id, "label", e.target.value)} className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Trigger Condition</Label>
                  <Textarea placeholder="What needs to happen for this scenario to activate?" value={scenario.trigger} onChange={(e) => updateScenario(scenario.id, "trigger", e.target.value)} className="min-h-[60px] text-sm" />
                </div>
                <div className="grid sm:grid-cols-3 gap-2">
                  <div className="space-y-1"><Label className="text-xs">Targets</Label><input type="text" placeholder="18,500 → 18,540" value={scenario.targets} onChange={(e) => updateScenario(scenario.id, "targets", e.target.value)} className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" /></div>
                  <div className="space-y-1"><Label className="text-xs">Stop</Label><input type="text" placeholder="Back below POC" value={scenario.stop} onChange={(e) => updateScenario(scenario.id, "stop", e.target.value)} className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" /></div>
                  <div className="space-y-1"><Label className="text-xs">Probability %</Label><input type="number" min="0" max="100" value={scenario.probability} onChange={(e) => updateScenario(scenario.id, "probability", parseInt(e.target.value) || 0)} className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        <Label className="text-base font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4" />Additional Notes</Label>
        <Textarea placeholder="Any additional context, reminders, or observations for today's session..." value={formData.notes} onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))} className="min-h-[80px]" />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">Save Auction Plan</Button>
        <Button type="button" variant="outline" onClick={() => navigate("/")}>Cancel</Button>
      </div>
    </form>
  );
}

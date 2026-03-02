import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AuctionPlan, Direction, Coherence, Timeframe } from "@/types/auction";
import { cn } from "@/lib/utils";
import { Wand2, Plus, Trash2, Target, AlertTriangle, TrendingUp, BarChart3, Clock } from "lucide-react";

interface AuctionPlanFormProps {
  initialPlan?: Partial<AuctionPlan>;
  onSubmit: (plan: Omit<AuctionPlan, 'id' | 'createdAt' | 'updatedAt' | 'aiCritique'>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  mode: "premarket" | "live";
}

const STOP_PRESETS = [
  { label: "0.25pt", value: 0.25 },
  { label: "0.50pt", value: 0.5 },
  { label: "1pt", value: 1 },
  { label: "2pt", value: 2 },
  { label: "3pt", value: 3 },
  { label: "4pt", value: 4 },
];

const TIMEFRAME_OPTIONS: { value: Timeframe; label: string }[] = [
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "30m", label: "30 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "daily", label: "Daily" },
];

export function AuctionPlanForm({ initialPlan, onSubmit, onCancel, isLoading, mode }: AuctionPlanFormProps) {
  const [ticker, setTicker] = useState(initialPlan?.ticker || "");
  const [direction, setDirection] = useState<Direction>(initialPlan?.direction || "LONG");
  const [thesis, setThesis] = useState(initialPlan?.thesis || "");
  const [invalidationConditions, setInvalidationConditions] = useState(
    initialPlan?.invalidationConditions || [{ condition: "", timeframe: "15m" as Timeframe }]
  );
  const [keyLevels, setKeyLevels] = useState(initialPlan?.keyLevels || [{ level: 0, description: "" }]);
  const [entryTrigger, setEntryTrigger] = useState(initialPlan?.entryTrigger || "");
  const [stopLoss, setStopLoss] = useState(initialPlan?.stopLoss || 2);
  const [targets, setTargets] = useState(initialPlan?.targets || [{ price: 0, size: 1, rationale: "" }]);
  const [timeframe, setTimeframe] = useState<Timeframe>(initialPlan?.timeframe || "15m");
  const [tags, setTags] = useState<string[]>(initialPlan?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [requiresSpecialEvent, setRequiresSpecialEvent] = useState(initialPlan?.requiresSpecialEvent || false);

  const addInvalidationCondition = () => {
    setInvalidationConditions([...invalidationConditions, { condition: "", timeframe: "15m" as Timeframe }]);
  };

  const removeInvalidationCondition = (index: number) => {
    setInvalidationConditions(invalidationConditions.filter((_, i) => i !== index));
  };

  const updateInvalidationCondition = (index: number, field: string, value: string) => {
    const updated = [...invalidationConditions];
    updated[index] = { ...updated[index], [field]: value };
    setInvalidationConditions(updated);
  };

  const addKeyLevel = () => {
    setKeyLevels([...keyLevels, { level: 0, description: "" }]);
  };

  const removeKeyLevel = (index: number) => {
    setKeyLevels(keyLevels.filter((_, i) => i !== index));
  };

  const updateKeyLevel = (index: number, field: string, value: string | number) => {
    const updated = [...keyLevels];
    updated[index] = { ...updated[index], [field]: value };
    setKeyLevels(updated);
  };

  const addTarget = () => {
    setTargets([...targets, { price: 0, size: 1, rationale: "" }]);
  };

  const removeTarget = (index: number) => {
    setTargets(targets.filter((_, i) => i !== index));
  };

  const updateTarget = (index: number, field: string, value: string | number) => {
    const updated = [...targets];
    updated[index] = { ...updated[index], [field]: value };
    setTargets(updated);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !thesis || !entryTrigger) return;

    onSubmit({
      ticker: ticker.toUpperCase(),
      direction,
      thesis,
      invalidationConditions: invalidationConditions.filter(ic => ic.condition),
      keyLevels: keyLevels.filter(kl => kl.description),
      entryTrigger,
      stopLoss,
      targets: targets.filter(t => t.price > 0),
      timeframe,
      tags,
      requiresSpecialEvent,
      mode,
      status: "ACTIVE",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ticker" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ticker</Label>
          <Input
            id="ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="ES, NQ, SPY..."
            className="font-mono uppercase"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Direction</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={direction === "LONG" ? "default" : "outline"}
              size="sm"
              onClick={() => setDirection("LONG")}
              className={cn(
                "flex-1 text-xs",
                direction === "LONG" && "bg-success hover:bg-success/90 text-success-foreground"
              )}
            >
              Long
            </Button>
            <Button
              type="button"
              variant={direction === "SHORT" ? "default" : "outline"}
              size="sm"
              onClick={() => setDirection("SHORT")}
              className={cn(
                "flex-1 text-xs",
                direction === "SHORT" && "bg-danger hover:bg-danger/90 text-danger-foreground"
              )}
            >
              Short
            </Button>
          </div>
        </div>
      </div>

      {/* Timeframe */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          Primary Timeframe
        </Label>
        <Select value={timeframe} onValueChange={(v) => setTimeframe(v as Timeframe)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEFRAME_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Thesis */}
      <div className="space-y-2">
        <Label htmlFor="thesis" className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="h-3 w-3" />
          Trade Thesis
        </Label>
        <Textarea
          id="thesis"
          value={thesis}
          onChange={(e) => setThesis(e.target.value)}
          placeholder="Describe your auction market theory thesis, key price levels, and expected price path..."
          className="min-h-[100px] text-sm resize-none"
          required
        />
      </div>

      {/* Invalidation Conditions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3" />
            Invalidation Conditions
          </Label>
          <Button type="button" variant="ghost" size="sm" onClick={addInvalidationCondition} className="h-6 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {invalidationConditions.map((ic, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={ic.condition}
                onChange={(e) => updateInvalidationCondition(i, 'condition', e.target.value)}
                placeholder="e.g. Break below 4500 on 15m close"
                className="flex-1 text-sm"
              />
              <Select value={ic.timeframe} onValueChange={(v) => updateInvalidationCondition(i, 'timeframe', v)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEFRAME_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {invalidationConditions.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeInvalidationCondition(i)} className="h-9 w-9 p-0">
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Levels */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Target className="h-3 w-3" />
            Key Price Levels
          </Label>
          <Button type="button" variant="ghost" size="sm" onClick={addKeyLevel} className="h-6 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {keyLevels.map((kl, i) => (
            <div key={i} className="flex gap-2">
              <Input
                type="number"
                value={kl.level || ""}
                onChange={(e) => updateKeyLevel(i, 'level', parseFloat(e.target.value) || 0)}
                placeholder="Price"
                className="w-24 text-sm font-mono"
                step="0.25"
              />
              <Input
                value={kl.description}
                onChange={(e) => updateKeyLevel(i, 'description', e.target.value)}
                placeholder="e.g. Prior day high, POC, VWAP..."
                className="flex-1 text-sm"
              />
              {keyLevels.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeKeyLevel(i)} className="h-9 w-9 p-0">
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Entry Trigger */}
      <div className="space-y-2">
        <Label htmlFor="entryTrigger" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Entry Trigger</Label>
        <Textarea
          id="entryTrigger"
          value={entryTrigger}
          onChange={(e) => setEntryTrigger(e.target.value)}
          placeholder="Specific conditions that must be met before entering the trade..."
          className="min-h-[80px] text-sm resize-none"
          required
        />
      </div>

      {/* Stop Loss */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="h-3 w-3" />
          Stop Loss (points)
        </Label>
        <div className="flex gap-2 flex-wrap">
          {STOP_PRESETS.map(preset => (
            <Button
              key={preset.value}
              type="button"
              variant={stopLoss === preset.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStopLoss(preset.value)}
              className="text-xs h-7"
            >
              {preset.label}
            </Button>
          ))}
          <Input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
            className="w-20 h-7 text-sm font-mono"
            step="0.25"
          />
        </div>
      </div>

      {/* Targets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Price Targets</Label>
          <Button type="button" variant="ghost" size="sm" onClick={addTarget} className="h-6 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {targets.map((target, i) => (
            <div key={i} className="flex gap-2">
              <Input
                type="number"
                value={target.price || ""}
                onChange={(e) => updateTarget(i, 'price', parseFloat(e.target.value) || 0)}
                placeholder="Price"
                className="w-24 text-sm font-mono"
                step="0.25"
              />
              <Input
                type="number"
                value={target.size}
                onChange={(e) => updateTarget(i, 'size', parseFloat(e.target.value) || 1)}
                placeholder="Size"
                className="w-16 text-sm font-mono"
                min="0.1"
                step="0.1"
              />
              <Input
                value={target.rationale}
                onChange={(e) => updateTarget(i, 'rationale', e.target.value)}
                placeholder="e.g. Prior swing high, measured move"
                className="flex-1 text-sm"
              />
              {targets.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeTarget(i)} className="h-9 w-9 p-0">
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tags</Label>
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Add tags (press Enter)"
          className="text-sm"
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer"
                onClick={() => setTags(tags.filter(t => t !== tag))}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Special Event Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/20">
        <div>
          <p className="text-sm font-medium">Requires Special Event</p>
          <p className="text-xs text-muted-foreground">FOMC, earnings, economic data, etc.</p>
        </div>
        <Switch
          checked={requiresSpecialEvent}
          onCheckedChange={setRequiresSpecialEvent}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isLoading || !ticker || !thesis || !entryTrigger} className="flex-1 gap-2">
          <Wand2 className="h-4 w-4" />
          {isLoading ? "Analyzing..." : "Submit for AI Analysis"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
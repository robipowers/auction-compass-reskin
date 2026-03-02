import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { EmotionSelector } from "./EmotionSelector";
import { ScreenshotUpload, type Screenshot } from "./ScreenshotUpload";
import { TagInput } from "./TagInput";
import { Save, X, TrendingUp, TrendingDown, Eye, Image, Tag, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  JournalEntryFormData,
  JournalEntryWithDetails,
  Emotion,
  TradeDirection,
  ScenarioValidationStatus,
  EntryTiming,
} from "@/types/journal";

interface JournalEntryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingEntry?: JournalEntryWithDetails | null;
  onSave: (data: JournalEntryFormData) => void;
  isQuickEntry?: boolean;
}

const defaultFormData: JournalEntryFormData = {
  trade_date: new Date().toISOString().split("T")[0],
  instrument: "",
  direction: null,
  entry_price: "",
  exit_price: "",
  pnl_pips: "",
  pnl_dollars: "",
  pre_trade_emotion: [],
  during_trade_emotion: [],
  post_trade_emotion: [],
  what_went_well: "",
  what_to_improve: "",
  lesson_learned: "",
  auction_plan_id: null,
  scenario_traded: "",
  followed_plan: null,
  plan_deviation_reason: "",
  scenario_validation_status: null,
  entry_timing: null,
};

export function JournalEntryDrawer({
  open,
  onOpenChange,
  editingEntry,
  onSave,
  isQuickEntry = false,
}: JournalEntryDrawerProps) {
  const [formData, setFormData] = useState<JournalEntryFormData>(defaultFormData);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        trade_date: editingEntry.trade_date,
        instrument: editingEntry.instrument,
        direction: editingEntry.direction,
        entry_price: editingEntry.entry_price?.toString() || "",
        exit_price: editingEntry.exit_price?.toString() || "",
        pnl_pips: editingEntry.pnl_pips?.toString() || "",
        pnl_dollars: editingEntry.pnl_dollars?.toString() || "",
        pre_trade_emotion: editingEntry.pre_trade_emotion || [],
        during_trade_emotion: editingEntry.during_trade_emotion || [],
        post_trade_emotion: editingEntry.post_trade_emotion || [],
        what_went_well: editingEntry.what_went_well || "",
        what_to_improve: editingEntry.what_to_improve || "",
        lesson_learned: editingEntry.lesson_learned || "",
        auction_plan_id: editingEntry.auction_plan_id,
        scenario_traded: editingEntry.scenario_traded || "",
        followed_plan: editingEntry.followed_plan,
        plan_deviation_reason: editingEntry.plan_deviation_reason || "",
        scenario_validation_status: editingEntry.scenario_validation_status,
        entry_timing: editingEntry.entry_timing,
      });
    } else {
      setFormData(defaultFormData);
      setScreenshots([]);
      setTags([]);
    }
  }, [editingEntry, open]);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const updateField = <K extends keyof JournalEntryFormData>(
    key: K,
    value: JournalEntryFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto" side="right">
        <SheetHeader className="pb-4 border-b border-border/50">
          <SheetTitle className="flex items-center gap-2">
            {isQuickEntry ? "Quick Journal Entry" : editingEntry ? "Edit Entry" : "New Journal Entry"}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Trade Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date</Label>
                <Input type="date" value={formData.trade_date} onChange={(e) => updateField("trade_date", e.target.value)} />
              </div>
              <div>
                <Label>Instrument</Label>
                <Input placeholder="e.g. NQ, ES, EURUSD" value={formData.instrument} onChange={(e) => updateField("instrument", e.target.value.toUpperCase())} />
              </div>
            </div>
            <div>
              <Label>Direction</Label>
              <div className="flex gap-2 mt-1">
                <Button type="button" variant={formData.direction === "long" ? "default" : "outline"} size="sm"
                  className={cn(formData.direction === "long" && "bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30")}
                  onClick={() => updateField("direction", formData.direction === "long" ? null : "long")}>
                  <TrendingUp className="h-4 w-4 mr-1" /> Long
                </Button>
                <Button type="button" variant={formData.direction === "short" ? "default" : "outline"} size="sm"
                  className={cn(formData.direction === "short" && "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30")}
                  onClick={() => updateField("direction", formData.direction === "short" ? null : "short")}>
                  <TrendingDown className="h-4 w-4 mr-1" /> Short
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Entry Price</Label><Input type="number" step="any" placeholder="0.00" value={formData.entry_price} onChange={(e) => updateField("entry_price", e.target.value)} /></div>
              <div><Label>Exit Price</Label><Input type="number" step="any" placeholder="0.00" value={formData.exit_price} onChange={(e) => updateField("exit_price", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>P&L (Pips)</Label><Input type="number" step="any" placeholder="0" value={formData.pnl_pips} onChange={(e) => updateField("pnl_pips", e.target.value)} /></div>
              <div><Label>P&L ($)</Label><Input type="number" step="any" placeholder="0.00" value={formData.pnl_dollars} onChange={(e) => updateField("pnl_dollars", e.target.value)} /></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Emotional State</h3>
            <EmotionSelector label="Pre-Trade" selected={formData.pre_trade_emotion} onChange={(emotions) => updateField("pre_trade_emotion", emotions)} />
            {!isQuickEntry && (
              <>
                <EmotionSelector label="During Trade" selected={formData.during_trade_emotion} onChange={(emotions) => updateField("during_trade_emotion", emotions)} />
                <EmotionSelector label="Post-Trade" selected={formData.post_trade_emotion} onChange={(emotions) => updateField("post_trade_emotion", emotions)} />
              </>
            )}
          </div>

          {!isQuickEntry && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Plan Connection</h3>
              <div>
                <Label>Scenario Traded</Label>
                <Input placeholder="e.g. Scenario A - Bullish breakout above 18,400" value={formData.scenario_traded} onChange={(e) => updateField("scenario_traded", e.target.value)} />
              </div>
              <div className="flex items-center gap-3">
                <Label className="text-sm">Followed Plan?</Label>
                <div className="flex gap-2">
                  <Button type="button" variant={formData.followed_plan === true ? "default" : "outline"} size="sm"
                    className={cn(formData.followed_plan === true && "bg-green-500/20 text-green-400")}
                    onClick={() => updateField("followed_plan", formData.followed_plan === true ? null : true)}>Yes</Button>
                  <Button type="button" variant={formData.followed_plan === false ? "default" : "outline"} size="sm"
                    className={cn(formData.followed_plan === false && "bg-red-500/20 text-red-400")}
                    onClick={() => updateField("followed_plan", formData.followed_plan === false ? null : false)}>No</Button>
                </div>
              </div>
              {formData.followed_plan === false && (
                <div>
                  <Label>Deviation Reason</Label>
                  <Textarea placeholder="Why did you deviate from the plan?" value={formData.plan_deviation_reason} onChange={(e) => updateField("plan_deviation_reason", e.target.value)} rows={2} />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Scenario Validation</Label>
                  <Select value={formData.scenario_validation_status || "none"} onValueChange={(v) => updateField("scenario_validation_status", v === "none" ? null : (v as ScenarioValidationStatus))}>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not set</SelectItem>
                      <SelectItem value="validated">Validated</SelectItem>
                      <SelectItem value="partially_validated">Partially Validated</SelectItem>
                      <SelectItem value="invalidated">Invalidated</SelectItem>
                      <SelectItem value="premature_entry">Premature Entry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Entry Timing</Label>
                  <Select value={formData.entry_timing || "none"} onValueChange={(v) => updateField("entry_timing", v === "none" ? null : (v as EntryTiming))}>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not set</SelectItem>
                      <SelectItem value="on_signal">On Signal</SelectItem>
                      <SelectItem value="early">Early</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="missed">Missed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {!isQuickEntry && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-2"><Camera className="h-4 w-4" /> Screenshots</h3>
              <ScreenshotUpload screenshots={screenshots} onScreenshotsChange={setScreenshots} />
            </div>
          )}

          {!isQuickEntry && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-2"><Tag className="h-4 w-4" /> Tags</h3>
              <TagInput tags={tags} onChange={setTags} />
            </div>
          )}

          {!isQuickEntry && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Reflection</h3>
              <div><Label className="text-sm text-green-400">What went well?</Label><Textarea placeholder="What did you execute well in this trade?" value={formData.what_went_well} onChange={(e) => updateField("what_went_well", e.target.value)} rows={2} /></div>
              <div><Label className="text-sm text-yellow-400">What to improve?</Label><Textarea placeholder="What could you have done better?" value={formData.what_to_improve} onChange={(e) => updateField("what_to_improve", e.target.value)} rows={2} /></div>
              <div><Label className="text-sm text-blue-400">Key Lesson</Label><Textarea placeholder="What's the main takeaway from this trade?" value={formData.lesson_learned} onChange={(e) => updateField("lesson_learned", e.target.value)} rows={2} /></div>
            </div>
          )}
        </div>

        <SheetFooter className="pt-4 border-t border-border/50 flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
          <Button onClick={handleSave} className="flex-1"><Save className="h-4 w-4 mr-1" /> {editingEntry ? "Update Entry" : "Save Entry"}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

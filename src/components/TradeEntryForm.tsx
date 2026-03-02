import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";

export interface Trade {
  id: string;
  direction: "long" | "short";
  entryPrice: number;
  exitPrice?: number;
  size: number;
  entryTime: Date;
  exitTime?: Date;
  notes: string;
  pnl?: number;
  scenarioId?: string;
}

interface TradeEntryFormProps {
  onSubmit: (trade: Omit<Trade, "id">) => void;
  scenarios?: { id: string; name: string }[];
  className?: string;
}

export function TradeEntryForm({ onSubmit, scenarios = [], className }: TradeEntryFormProps) {
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [size, setSize] = useState("1");
  const [notes, setNotes] = useState("");
  const [scenarioId, setScenarioId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const entry = parseFloat(entryPrice);
    const exit = exitPrice ? parseFloat(exitPrice) : undefined;
    const qty = parseInt(size);
    
    if (isNaN(entry) || isNaN(qty)) return;

    // Calculate P&L if exit price provided
    let pnl: number | undefined;
    if (exit) {
      const pointValue = 20; // NQ futures point value
      const points = direction === "long" ? exit - entry : entry - exit;
      pnl = points * qty * pointValue;
    }

    onSubmit({
      direction,
      entryPrice: entry,
      exitPrice: exit,
      size: qty,
      entryTime: new Date(),
      exitTime: exit ? new Date() : undefined,
      notes,
      pnl,
      scenarioId: scenarioId || undefined,
    });

    // Reset form
    setEntryPrice("");
    setExitPrice("");
    setSize("1");
    setNotes("");
    setScenarioId("");
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Log Trade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Direction Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={direction === "long" ? "default" : "outline"}
              className={cn(
                direction === "long" && "bg-green-600 hover:bg-green-700"
              )}
              onClick={() => setDirection("long")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Long
            </Button>
            <Button
              type="button"
              variant={direction === "short" ? "default" : "outline"}
              className={cn(
                direction === "short" && "bg-red-600 hover:bg-red-700"
              )}
              onClick={() => setDirection("short")}
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Short
            </Button>
          </div>

          {/* Entry/Exit Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Entry Price</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="18425.00"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Exit Price (optional)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="18450.00"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Size and Scenario */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Size</Label>
              <Input
                type="number"
                min="1"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
              />
            </div>
            {scenarios.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs">Scenario</Label>
                <Select value={scenarioId} onValueChange={setScenarioId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs">Notes</Label>
            <Textarea
              placeholder="Trade rationale..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full">
            Log Trade
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

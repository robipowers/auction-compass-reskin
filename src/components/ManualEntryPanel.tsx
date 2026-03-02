import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";

type TradeDirection = "long" | "short" | "neutral";
type EntryType = "market" | "limit" | "stop";

interface ManualTrade {
  id: string;
  time: string;
  direction: TradeDirection;
  entry: string;
  target: string;
  stop: string;
  size: string;
  entryType: EntryType;
  notes: string;
  outcome?: "win" | "loss" | "breakeven" | "pending";
  pnl?: string;
}

export function ManualEntryPanel() {
  const [trades, setTrades] = useState<ManualTrade[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTrade, setNewTrade] = useState<Partial<ManualTrade>>({
    direction: "neutral",
    entryType: "market",
    outcome: "pending",
  });

  const addTrade = () => {
    if (!newTrade.entry || !newTrade.time) return;
    
    const trade: ManualTrade = {
      id: crypto.randomUUID(),
      time: newTrade.time || new Date().toISOString(),
      direction: newTrade.direction || "neutral",
      entry: newTrade.entry || "",
      target: newTrade.target || "",
      stop: newTrade.stop || "",
      size: newTrade.size || "1",
      entryType: newTrade.entryType || "market",
      notes: newTrade.notes || "",
      outcome: newTrade.outcome || "pending",
      pnl: newTrade.pnl,
    };
    
    setTrades([...trades, trade]);
    setNewTrade({ direction: "neutral", entryType: "market", outcome: "pending" });
    setIsAdding(false);
  };

  const removeTrade = (id: string) => {
    setTrades(trades.filter(t => t.id !== id));
  };

  const directionIcon = (dir: TradeDirection) => {
    if (dir === "long") return <TrendingUp className="h-4 w-4 text-success" />;
    if (dir === "short") return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const outcomeColor = (outcome?: string) => {
    switch (outcome) {
      case "win": return "text-success";
      case "loss": return "text-destructive";
      case "breakeven": return "text-muted-foreground";
      default: return "text-foreground";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Manual Trade Log
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAdding(!isAdding)}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Trade
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add Trade Form */}
        {isAdding && (
          <div className="p-3 border rounded-lg space-y-3 bg-muted/30">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Time</Label>
                <Input
                  type="time"
                  className="h-8 text-sm"
                  value={newTrade.time || ""}
                  onChange={e => setNewTrade({ ...newTrade, time: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs">Direction</Label>
                <Select
                  value={newTrade.direction}
                  onValueChange={v => setNewTrade({ ...newTrade, direction: v as TradeDirection })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Entry</Label>
                <Input
                  className="h-8 text-sm"
                  placeholder="Price"
                  value={newTrade.entry || ""}
                  onChange={e => setNewTrade({ ...newTrade, entry: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs">Target</Label>
                <Input
                  className="h-8 text-sm"
                  placeholder="Price"
                  value={newTrade.target || ""}
                  onChange={e => setNewTrade({ ...newTrade, target: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs">Stop</Label>
                <Input
                  className="h-8 text-sm"
                  placeholder="Price"
                  value={newTrade.stop || ""}
                  onChange={e => setNewTrade({ ...newTrade, stop: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Size</Label>
                <Input
                  className="h-8 text-sm"
                  placeholder="Contracts"
                  value={newTrade.size || ""}
                  onChange={e => setNewTrade({ ...newTrade, size: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs">P&L</Label>
                <Input
                  className="h-8 text-sm"
                  placeholder="+/- amount"
                  value={newTrade.pnl || ""}
                  onChange={e => setNewTrade({ ...newTrade, pnl: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Outcome</Label>
              <Select
                value={newTrade.outcome}
                onValueChange={v => setNewTrade({ ...newTrade, outcome: v as ManualTrade["outcome"] })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="win">Win</SelectItem>
                  <SelectItem value="loss">Loss</SelectItem>
                  <SelectItem value="breakeven">Breakeven</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Notes</Label>
              <Textarea
                className="text-sm resize-none"
                rows={2}
                placeholder="Trade notes..."
                value={newTrade.notes || ""}
                onChange={e => setNewTrade({ ...newTrade, notes: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={addTrade} className="flex-1">Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Trades List */}
        {trades.length === 0 && !isAdding ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No trades logged yet
          </p>
        ) : (
          <div className="space-y-2">
            {trades.map(trade => (
              <div key={trade.id} className="p-2.5 border rounded-lg text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {directionIcon(trade.direction)}
                    <span className="font-medium capitalize">{trade.direction}</span>
                    <span className="text-muted-foreground">{trade.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {trade.pnl && (
                      <span className={outcomeColor(trade.outcome)}>
                        {trade.pnl}
                      </span>
                    )}
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {trade.outcome}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-5 w-5"
                      onClick={() => removeTrade(trade.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 text-muted-foreground">
                  <span>E: {trade.entry}</span>
                  <span>T: {trade.target || '-'}</span>
                  <span>S: {trade.stop || '-'}</span>
                </div>
                {trade.notes && (
                  <p className="text-muted-foreground">{trade.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

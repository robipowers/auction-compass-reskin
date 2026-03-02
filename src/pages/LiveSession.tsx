import { useState, useEffect, useRef } from "react";
import { useMarketData } from "@/contexts/MarketDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Play, Square, Clock, TrendingUp, TrendingDown, Activity, MessageSquare, CheckCircle2, XCircle } from "lucide-react";

interface SessionNote { id: string; time: string; text: string; type: "observation" | "trade" | "scenario" | "exit"; }
interface ScenarioStatus { id: string; name: string; status: "watching" | "triggered" | "invalidated" | "completed"; triggeredAt?: string; }

export default function LiveSession() {
  const { marketData, connectionStatus } = useMarketData();
  const [isActive, setIsActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [scenarios, setScenarios] = useState<ScenarioStatus[]>([
    { id: "a", name: "Scenario A: Continuation Higher", status: "watching" },
    { id: "b", name: "Scenario B: Range Development", status: "watching" },
    { id: "c", name: "Scenario C: Reversal Lower", status: "watching" },
  ]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const notesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive) { timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000); }
    else { if (timerRef.current) clearInterval(timerRef.current); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive]);

  useEffect(() => { notesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [notes]);

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const addNote = () => {
    if (!noteInput.trim()) return;
    const note: SessionNote = { id: Date.now().toString(), time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), text: noteInput, type: "observation" };
    setNotes((prev) => [...prev, note]);
    setNoteInput("");
  };

  const updateScenario = (id: string, status: ScenarioStatus["status"]) => {
    setScenarios((prev) => prev.map((s) => s.id === id ? { ...s, status, triggeredAt: status === "triggered" ? new Date().toLocaleTimeString() : s.triggeredAt } : s));
    const scenario = scenarios.find((s) => s.id === id);
    if (scenario) {
      const note: SessionNote = { id: Date.now().toString(), time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), text: `${scenario.name} → ${status}`, type: "scenario" };
      setNotes((prev) => [...prev, note]);
    }
  };

  const getScenarioColor = (status: ScenarioStatus["status"]) => {
    switch (status) {
      case "triggered": return "bg-green-500/20 border-green-500/50 text-green-400";
      case "invalidated": return "bg-red-500/20 border-red-500/50 text-red-400";
      case "completed": return "bg-blue-500/20 border-blue-500/50 text-blue-400";
      default: return "bg-secondary/50 border-border";
    }
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Live Session</h1>
          <div className="flex items-center gap-3 mt-1">
            <div className={cn("flex items-center gap-1.5 text-sm", connectionStatus === "connected" ? "text-green-400" : "text-muted-foreground")}>
              <div className={cn("h-2 w-2 rounded-full", connectionStatus === "connected" ? "bg-green-400 animate-pulse" : "bg-muted")} />
              {connectionStatus === "connected" ? "Live" : "Disconnected"}
            </div>
            {isActive && <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock className="h-3.5 w-3.5" />{formatElapsed(elapsed)}</div>}
          </div>
        </div>
        <div className="flex gap-3">
          {!isActive ? (
            <Button onClick={() => setIsActive(true)} size="lg"><Play className="h-4 w-4 mr-2" />Start Session</Button>
          ) : (
            <Button onClick={() => setIsActive(false)} variant="destructive" size="lg"><Square className="h-4 w-4 mr-2" />End Session</Button>
          )}
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{marketData.symbol}</CardTitle></CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tabular-nums">{marketData.lastPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
              <div className={cn("flex items-center gap-1 mt-1 text-sm", marketData.change >= 0 ? "text-green-400" : "text-red-400")}>
                {marketData.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {marketData.change >= 0 ? "+" : ""}{marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Session Stats</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">High</span><span className="font-medium">{marketData.high.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Low</span><span className="font-medium">{marketData.low.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Volume</span><span className="font-medium">{marketData.volume.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">VWAP</span><span className="font-medium">{marketData.vwap?.toFixed(2) ?? "N/A"}</span></div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Scenario Tracker</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {scenarios.map((scenario) => (
                <div key={scenario.id} className={cn("p-3 rounded-lg border transition-colors", getScenarioColor(scenario.status))}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{scenario.name}</span>
                    <Badge variant="outline" className="text-[10px]">{scenario.status}</Badge>
                  </div>
                  {scenario.status === "watching" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => updateScenario(scenario.id, "triggered")}><CheckCircle2 className="h-3 w-3 mr-1" />Trigger</Button>
                      <Button size="sm" variant="outline" className="h-6 text-xs text-destructive" onClick={() => updateScenario(scenario.id, "invalidated")}><XCircle className="h-3 w-3 mr-1" />Invalidate</Button>
                    </div>
                  )}
                  {scenario.triggeredAt && <div className="text-[10px] text-muted-foreground mt-1">at {scenario.triggeredAt}</div>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="flex flex-col">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="h-4 w-4" />Session Notes</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="h-64 overflow-y-auto space-y-2 pr-1">
                {notes.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">Notes will appear here during your session</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className={cn("p-2 rounded text-xs", note.type === "scenario" ? "bg-primary/10 border border-primary/20" : "bg-secondary/50")}>
                      <span className="text-muted-foreground mr-2">{note.time}</span>{note.text}
                    </div>
                  ))
                )}
                <div ref={notesEndRef} />
              </div>
              <div className="flex gap-2">
                <Textarea placeholder="Add observation..." className="min-h-[60px] text-xs resize-none" value={noteInput} onChange={(e) => setNoteInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addNote(); } }} />
              </div>
              <Button size="sm" onClick={addNote} disabled={!noteInput.trim()}>Add Note</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

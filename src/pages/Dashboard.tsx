import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Play, FileText, Clock, Activity, Target, DollarSign, Zap, ChevronRight } from "lucide-react";

interface Scenario { id: string; name: string; trigger: string; probability: number; }
interface ActivityItem { id: string; time: string; text: string; type: "trade" | "scenario" | "session" | "plan"; }

const mockPlan = {
  id: "plan-1",
  context: "Balanced profile, neutral inventory, opening inside value",
  structure: "coherent" as const,
  scenarios: [
    { id: "a", name: "Scenario A: Continuation Higher", trigger: "Break above 18,450 with acceptance", probability: 45 },
    { id: "b", name: "Scenario B: Range Development", trigger: "Rejection at 18,450, support at 18,380", probability: 35 },
    { id: "c", name: "Scenario C: Reversal Lower", trigger: "Break below 18,380 with initiative selling", probability: 20 },
  ] as Scenario[],
};

const mockStats = { todayPnL: 420, winRate: "3/5", activeScenario: "A", sessionPhase: "Pre-Market" as const };

const mockActivity: ActivityItem[] = [
  { id: "1", time: "9:42 AM", text: "Trade executed: Long 2 NQ @ 18,425", type: "trade" },
  { id: "2", time: "9:35 AM", text: "Scenario A triggered - Break above 18,450", type: "scenario" },
  { id: "3", time: "9:30 AM", text: "Session started - Market open", type: "session" },
  { id: "4", time: "8:45 AM", text: "Plan created with AI analysis", type: "plan" },
];

function SessionPhaseIndicator({ phase }: { phase: string }) {
  const phases = ["Pre-Market", "Open", "Mid-Session", "Close"];
  const currentIndex = phases.indexOf(phase);
  return (
    <div className="flex items-center gap-2">
      {phases.map((p, i) => (
        <div key={p} className="flex items-center gap-1">
          <div className={cn("h-2 w-2 rounded-full", i < currentIndex && "bg-green-500", i === currentIndex && "bg-primary animate-pulse", i > currentIndex && "bg-muted")} />
          <span className={cn("text-xs", i === currentIndex ? "text-foreground font-medium" : "text-muted-foreground")}>{p}</span>
        </div>
      ))}
    </div>
  );
}

function QuickStats({ stats }: { stats: typeof mockStats }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="bg-secondary/50"><CardContent className="p-4 text-center">
        <div className={cn("text-2xl font-bold", stats.todayPnL >= 0 ? "text-green-400" : "text-red-400")}>
          {stats.todayPnL >= 0 ? "+" : ""}{stats.todayPnL.toLocaleString("en-US", { style: "currency", currency: "USD" })}
        </div>
        <div className="text-xs uppercase text-muted-foreground mt-1">Today P&L</div>
      </CardContent></Card>
      <Card className="bg-secondary/50"><CardContent className="p-4 text-center">
        <div className="text-2xl font-bold">{stats.winRate}</div>
        <div className="text-xs uppercase text-muted-foreground mt-1">Win Rate</div>
      </CardContent></Card>
      <Card className="bg-secondary/50"><CardContent className="p-4 text-center">
        <div className="text-2xl font-bold">{stats.activeScenario}</div>
        <div className="text-xs uppercase text-muted-foreground mt-1">Active Scenario</div>
      </CardContent></Card>
    </div>
  );
}

function TodaysPlanCard({ plan }: { plan: typeof mockPlan }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Today's Auction Plan</CardTitle>
          <Badge variant="outline" className={cn(plan.structure === "coherent" ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-amber-500/20 text-amber-400 border-amber-500/50")}>
            {plan.structure === "coherent" ? "Coherent Structure" : "Divergent Structure"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-xs uppercase text-muted-foreground mb-2">Context</div>
          <p className="text-sm">{plan.context}</p>
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground mb-2">Key Scenarios</div>
          <div className="space-y-2">
            {plan.scenarios.map((scenario) => (
              <div key={scenario.id} className="p-3 bg-secondary/50 rounded-lg border-l-3 border-l-primary">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{scenario.name}</span>
                  <span className="text-xs text-muted-foreground">{scenario.probability}%</span>
                </div>
                <span className="text-xs text-muted-foreground">Trigger: {scenario.trigger}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button asChild className="flex-1"><Link to="/live"><Play className="h-4 w-4 mr-2" />Start Live Session</Link></Button>
          <Button variant="outline" asChild><Link to="/plan"><FileText className="h-4 w-4 mr-2" />View Full Analysis</Link></Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "trade": return <DollarSign className="h-3 w-3" />;
      case "scenario": return <Target className="h-3 w-3" />;
      case "session": return <Activity className="h-3 w-3" />;
      case "plan": return <FileText className="h-3 w-3" />;
    }
  };
  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Recent Activity</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
            <div className="mt-1 p-1.5 rounded-full bg-primary/20 text-primary">{getIcon(item.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">{item.time}</div>
              <div className="text-sm truncate">{item.text}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 60000); return () => clearInterval(timer); }, []);
  const formattedDate = currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
            <SessionPhaseIndicator phase={mockStats.sessionPhase} />
          </div>
        </div>
        <Button asChild><Link to="/plan"><Zap className="h-4 w-4 mr-2" />Create New Plan</Link></Button>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6"><TodaysPlanCard plan={mockPlan} /></div>
        <div className="space-y-6"><QuickStats stats={mockStats} /><ActivityFeed activities={mockActivity} /></div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="group cursor-pointer hover:border-primary/50 transition-colors">
          <Link to="/journal"><CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/20"><FileText className="h-5 w-5 text-primary" /></div><span className="font-medium">Trade Journal</span></div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardContent></Link>
        </Card>
        <Card className="group cursor-pointer hover:border-primary/50 transition-colors">
          <Link to="/analytics"><CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/20"><TrendingUp className="h-5 w-5 text-green-400" /></div><span className="font-medium">Analytics</span></div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardContent></Link>
        </Card>
        <Card className="group cursor-pointer hover:border-primary/50 transition-colors">
          <Link to="/charting"><CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/20"><Activity className="h-5 w-5 text-amber-400" /></div><span className="font-medium">Charting Tools</span></div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardContent></Link>
        </Card>
      </div>
    </main>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePlans } from "@/hooks/use-plans";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, TrendingDown, Target, Brain, Calendar, Download } from "lucide-react";

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

export default function Analytics() {
  const { plans } = usePlans();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  // Filter plans by time range
  const filteredPlans = plans.filter(p => {
    if (timeRange === "all") return true;
    const days = { "7d": 7, "30d": 30, "90d": 90 }[timeRange];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Date(p.date) >= cutoff;
  });

  // Core stats
  const total = filteredPlans.length;
  const wins = filteredPlans.filter(p => p.outcome === "win").length;
  const losses = filteredPlans.filter(p => p.outcome === "loss").length;
  const breakeven = filteredPlans.filter(p => p.outcome === "breakeven").length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  // Outcome distribution for pie chart
  const outcomeData = [
    { name: "Win", value: wins },
    { name: "Loss", value: losses },
    { name: "Breakeven", value: breakeven },
    { name: "Pending", value: total - wins - losses - breakeven },
  ].filter(d => d.value > 0);

  // Scenario accuracy
  const plansWithScenarios = filteredPlans.filter(p => p.scenarios?.length > 0);
  const scenarioData = [
    { name: "Bullish", played: 0, correct: 0 },
    { name: "Bearish", played: 0, correct: 0 },
    { name: "Balanced", played: 0, correct: 0 },
  ];

  plansWithScenarios.forEach(plan => {
    plan.scenarios?.forEach(scenario => {
      const type = scenario.type || "balanced";
      const entry = scenarioData.find(s => s.name.toLowerCase() === type.toLowerCase());
      if (entry) {
        entry.played++;
        if (scenario.played) entry.correct++;
      }
    });
  });

  // Win rate over time (last 30 sessions)
  const recentPlans = [...filteredPlans]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30);

  const winRateTrend = recentPlans.map((plan, idx) => {
    const slice = recentPlans.slice(0, idx + 1);
    const sliceWins = slice.filter(p => p.outcome === "win").length;
    const sliceTotal = slice.filter(p => p.outcome && p.outcome !== "pending").length;
    return {
      session: idx + 1,
      winRate: sliceTotal > 0 ? Math.round((sliceWins / sliceTotal) * 100) : 0,
      date: new Date(plan.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });

  return (
    <div className="container mx-auto py-8 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">Performance insights from your auction plans</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={v => setTimeRange(v as typeof timeRange)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-xs text-muted-foreground">Total Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/15 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{winRate}%</div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/15 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{wins}</div>
                <div className="text-xs text-muted-foreground">Wins</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/15 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <div className="text-2xl font-bold">{losses}</div>
                <div className="text-xs text-muted-foreground">Losses</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Outcome Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Outcome Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {total === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={outcomeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {outcomeData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Win Rate Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Win Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {winRateTrend.length < 2 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Need more data</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={winRateTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => [`${v}%`, 'Win Rate']} />
                      <Line
                        type="monotone"
                        dataKey="winRate"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scenario Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {plansWithScenarios.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No scenario data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={scenarioData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="played" fill="hsl(var(--muted-foreground))" name="Played" radius={[4,4,0,0]} />
                    <Bar dataKey="correct" fill="hsl(var(--success))" name="Correct" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4 mt-4">
          <Card>
            <CardContent className="py-12 text-center">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Advanced trend analysis coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

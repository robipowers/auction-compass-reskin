import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePlans } from "@/hooks/use-plans";
import { format } from "date-fns";
import { Search, Calendar, Filter, FileText, TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";

export default function History() {
  const { plans, deletePlan } = usePlans();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterOutcome, setFilterOutcome] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "outcome">("date");

  const filtered = plans
    .filter(p => {
      if (search && !JSON.stringify(p).toLowerCase().includes(search.toLowerCase())) return false;
      if (filterOutcome !== "all" && p.outcome !== filterOutcome) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
      return (a.outcome || "").localeCompare(b.outcome || "");
    });

  const stats = {
    total: plans.length,
    wins: plans.filter(p => p.outcome === "win").length,
    losses: plans.filter(p => p.outcome === "loss").length,
    breakeven: plans.filter(p => p.outcome === "breakeven").length,
  };
  const winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;

  const outcomeIcon = (outcome?: string) => {
    if (outcome === "win") return <TrendingUp className="h-4 w-4 text-success" />;
    if (outcome === "loss") return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const outcomeVariant = (outcome?: string) => {
    if (outcome === "win") return "success" as const;
    if (outcome === "loss") return "destructive" as const;
    return "secondary" as const;
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trading History</h1>
          <p className="text-sm text-muted-foreground">Review and analyze your past auction plans</p>
        </div>
        <Button onClick={() => navigate("/plan")} size="sm">
          New Plan
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Plans</div>
          </CardContent>
        </Card>
        <Card className="border-success/20">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-success">{stats.wins}</div>
            <div className="text-xs text-muted-foreground">Wins</div>
          </CardContent>
        </Card>
        <Card className="border-destructive/20">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-destructive">{stats.losses}</div>
            <div className="text-xs text-muted-foreground">Losses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{winRate}%</div>
            <div className="text-xs text-muted-foreground">Win Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plans..."
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterOutcome} onValueChange={setFilterOutcome}>
          <SelectTrigger className="w-[140px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Outcome" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Outcomes</SelectItem>
            <SelectItem value="win">Wins</SelectItem>
            <SelectItem value="loss">Losses</SelectItem>
            <SelectItem value="breakeven">Breakeven</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={v => setSortBy(v as "date" | "outcome")}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="outcome">Sort by Outcome</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Plans List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No plans found</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => navigate("/plan")}
            >
              Create your first plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((plan) => (
            <Card
              key={plan.id}
              variant="interactive"
              className="cursor-pointer"
              onClick={() => navigate(`/plan?id=${plan.id}`)}
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {outcomeIcon(plan.outcome)}
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {format(new Date(plan.date), "MMM d, yyyy")}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {plan.yesterdayContext?.trend || "No context"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.scenarios?.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {plan.scenarios.length} scenario{plan.scenarios.length > 1 ? "s" : ""}
                      </span>
                    )}
                    <Badge variant={outcomeVariant(plan.outcome)}>
                      {plan.outcome || "pending"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePlan(plan.id);
                      }}
                    >
                      <FileText className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

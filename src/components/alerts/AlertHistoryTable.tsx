import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, Download, Filter, Clock, Bell } from "lucide-react";

interface AlertHistoryEntry {
  id: string;
  alertId: string;
  alertName: string;
  instrument: string;
  condition: string;
  value?: number;
  priority: "critical" | "important" | "informational";
  triggeredAt: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
}

interface AlertHistoryTableProps {
  entries: AlertHistoryEntry[];
  isLoading?: boolean;
  onAcknowledge?: (id: string) => void;
  onExport?: () => void;
  className?: string;
}

const priorityStyles = {
  critical: "bg-red-500/20 text-red-400 border-red-500/50",
  important: "bg-amber-500/20 text-amber-400 border-amber-500/50",
  informational: "bg-blue-500/20 text-blue-400 border-blue-500/50",
};

export function AlertHistoryTable({
  entries,
  isLoading,
  onAcknowledge,
  onExport,
  className,
}: AlertHistoryTableProps) {
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "all">("week");

  const filterEntries = (entries: AlertHistoryEntry[]) => {
    const now = new Date();
    return entries.filter((entry) => {
      const date = new Date(entry.triggeredAt);
      switch (dateFilter) {
        case "today":
          return date.toDateString() === now.toDateString();
        case "week":
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return date >= weekAgo;
        case "month":
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return date >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredEntries = filterEntries(entries);

  return (
    <Card className={cn("bg-card", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Alert History
          </CardTitle>
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(["today", "week", "month", "all"] as const).map((period) => (
                <Button
                  key={period}
                  variant={dateFilter === period ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setDateFilter(period)}
                  className="rounded-none border-none capitalize text-xs"
                >
                  {period === "all" ? "All" : period}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left text-xs uppercase text-muted-foreground font-medium">Time</th>
                <th className="py-3 px-4 text-left text-xs uppercase text-muted-foreground font-medium">Alert</th>
                <th className="py-3 px-4 text-left text-xs uppercase text-muted-foreground font-medium">Instrument</th>
                <th className="py-3 px-4 text-left text-xs uppercase text-muted-foreground font-medium">Condition</th>
                <th className="py-3 px-4 text-left text-xs uppercase text-muted-foreground font-medium">Priority</th>
                <th className="py-3 px-4 text-left text-xs uppercase text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No alerts triggered in this period.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm">
                      <div>
                        {new Date(entry.triggeredAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(entry.triggeredAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{entry.alertName}</td>
                    <td className="py-3 px-4 text-sm font-mono">{entry.instrument}</td>
                    <td className="py-3 px-4 text-sm">
                      {entry.condition}
                      {entry.value && ` ${entry.value.toLocaleString()}`}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={cn("text-xs capitalize", priorityStyles[entry.priority])}>
                        {entry.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {entry.acknowledged ? (
                        <Badge variant="secondary" className="text-xs">
                          Acknowledged
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAcknowledge?.(entry.id)}
                          className="h-6 text-xs"
                        >
                          Mark read
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

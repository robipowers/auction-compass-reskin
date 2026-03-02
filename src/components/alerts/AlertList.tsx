import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Bell,
  BellOff,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { Alert } from "@/contexts/AlertContext";

interface AlertListProps {
  alerts: Alert[];
  onEdit?: (alert: Alert) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string, enabled: boolean) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  className?: string;
}

const priorityConfig = {
  critical: { color: "text-red-400 bg-red-500/20 border-red-500/50", icon: AlertTriangle },
  important: { color: "text-amber-400 bg-amber-500/20 border-amber-500/50", icon: Bell },
  informational: { color: "text-blue-400 bg-blue-500/20 border-blue-500/50", icon: Bell },
};

const conditionLabels: Record<string, string> = {
  price_above: "Price Above",
  price_below: "Price Below",
  vah_test: "VAH Test",
  val_test: "VAL Test",
  poc_test: "POC Test",
  volume_spike: "Volume Spike",
  delta_divergence: "Delta Divergence",
};

export function AlertList({
  alerts,
  onEdit,
  onDelete,
  onToggle,
  selectedIds = [],
  onSelectionChange,
  className,
}: AlertListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleSelect = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className={cn("bg-card", className)}>
        <CardContent className="py-12 text-center">
          <BellOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-1">No Alerts</h3>
          <p className="text-sm text-muted-foreground">
            Create alerts to get notified when market conditions match your scenarios.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {alerts.map((alert) => {
        const config = priorityConfig[alert.priority];
        const PriorityIcon = config.icon;
        const isExpanded = expandedId === alert.id;
        const isSelected = selectedIds.includes(alert.id);

        return (
          <Card
            key={alert.id}
            className={cn(
              "transition-all cursor-pointer hover:border-primary/50",
              isSelected && "border-primary ring-1 ring-primary/30",
              !alert.enabled && "opacity-60"
            )}
            onClick={() => setExpandedId(isExpanded ? null : alert.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Selection checkbox */}
                {onSelectionChange && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelect(alert.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1"
                  />
                )}

                {/* Priority icon */}
                <div className={cn("p-2 rounded-lg", config.color)}>
                  <PriorityIcon className="h-4 w-4" />
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{alert.name}</span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {conditionLabels[alert.condition] || alert.condition}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-mono">{alert.instrument}</span>
                    {alert.value && (
                      <span className="flex items-center gap-1">
                        {alert.condition.includes("above") ? (
                          <TrendingUp className="h-3 w-3 text-green-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-400" />
                        )}
                        {alert.value.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-border/50 space-y-2 text-sm">
                      {alert.message && (
                        <p className="text-muted-foreground">{alert.message}</p>
                      )}
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Created {new Date(alert.createdAt).toLocaleDateString()}
                        </span>
                        {alert.triggeredCount > 0 && (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Triggered {alert.triggeredCount}x
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={alert.enabled}
                    onCheckedChange={(checked) => onToggle?.(alert.id, checked)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit?.(alert)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete?.(alert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, BellOff, Bell, X } from "lucide-react";

interface AlertBulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onDisable: () => void;
  onEnable: () => void;
  onClear: () => void;
}

export function AlertBulkActions({
  selectedCount,
  onDelete,
  onDisable,
  onEnable,
  onClear,
}: AlertBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg border border-border">
      <Badge variant="secondary">{selectedCount} selected</Badge>
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={onEnable}>
          <Bell className="h-4 w-4 mr-1" />
          Enable
        </Button>
        <Button variant="ghost" size="sm" onClick={onDisable}>
          <BellOff className="h-4 w-4 mr-1" />
          Disable
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

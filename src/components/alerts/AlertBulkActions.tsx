import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, BellOff, Trash2, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertBulkActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onEnableSelected?: () => void;
  onDisableSelected?: () => void;
  onDeleteSelected?: () => void;
  className?: string;
}

export function AlertBulkActions({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onEnableSelected,
  onDisableSelected,
  onDeleteSelected,
  className,
}: AlertBulkActionsProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="font-mono">
          {selectedCount} / {totalCount}
        </Badge>
        <span className="text-sm text-muted-foreground">selected</span>
        
        {selectedCount < totalCount && (
          <Button variant="link" size="sm" onClick={onSelectAll} className="h-auto p-0">
            Select all
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Actions
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEnableSelected}>
              <Bell className="mr-2 h-4 w-4" />
              Enable selected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDisableSelected}>
              <BellOff className="mr-2 h-4 w-4" />
              Disable selected
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDeleteSelected}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDeselectAll}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

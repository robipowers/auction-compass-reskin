import { useState } from 'react';
import { X, Settings, GripVertical, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type PanelType = 'chart' | 'volume-profile' | 'order-flow' | 'internals' | 'scenarios';

export interface PanelConfig {
  id: string;
  type: PanelType;
  title: string;
  instrument?: string;
  gridColumn: string;
  gridRow: string;
}

interface WorkspacePanelProps {
  config: PanelConfig;
  isEditMode: boolean;
  children: React.ReactNode;
  onClose?: (id: string) => void;
  onSettings?: (id: string) => void;
}

export function WorkspacePanel({ 
  config, 
  isEditMode, 
  children, 
  onClose, 
  onSettings 
}: WorkspacePanelProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <div 
      className={cn(
        "bg-card border border-border rounded-lg overflow-hidden flex flex-col transition-all",
        isEditMode && "ring-2 ring-primary/30 ring-dashed",
        isMaximized && "fixed inset-4 z-50"
      )}
      style={{ 
        gridColumn: isMaximized ? undefined : config.gridColumn, 
        gridRow: isMaximized ? undefined : config.gridRow 
      }}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-secondary/50 border-b border-border">
        <div className="flex items-center gap-2">
          {isEditMode && (
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
          )}
          <span className="font-medium text-sm">{config.title}</span>
          {config.instrument && (
            <span className="text-xs text-muted-foreground">({config.instrument})</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => setIsMaximized(!isMaximized)}
          >
            {isMaximized ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
          {onSettings && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => onSettings(config.id)}
            >
              <Settings className="h-3 w-3" />
            </Button>
          )}
          {isEditMode && onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-destructive hover:text-destructive"
              onClick={() => onClose(config.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto p-3">
        {children}
      </div>
    </div>
  );
}

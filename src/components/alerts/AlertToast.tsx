import { useState } from 'react';
import { X, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertPriority } from '@/types/alerts';
import { cn } from '@/lib/utils';

interface AlertToastProps {
  alert: Alert;
  triggerPrice: number;
  triggeredAt: Date;
  coachingInsight?: string;
  onDismiss: () => void;
}

export function AlertToast({ 
  alert, 
  triggerPrice, 
  triggeredAt, 
  coachingInsight,
  onDismiss 
}: AlertToastProps) {
  const [showInsight, setShowInsight] = useState(false);

  const priorityColors: Record<AlertPriority, string> = {
    critical: 'border-l-red-500',
    important: 'border-l-yellow-500',
    informational: 'border-l-blue-500',
  };

  const priorityTitleColors: Record<AlertPriority, string> = {
    critical: 'text-red-400',
    important: 'text-yellow-400',
    informational: 'text-blue-400',
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const directionLabel = {
    above: 'broke above',
    below: 'broke below',
    crosses: 'crossed',
  };

  return (
    <div 
      className={cn(
        "bg-card border border-border rounded-lg shadow-xl overflow-hidden",
        "border-l-4 animate-in slide-in-from-right-5 duration-300",
        priorityColors[alert.priority]
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className={cn("font-semibold", priorityTitleColors[alert.priority])}>
          {alert.instrument} Alert: Price {directionLabel[alert.condition_direction]} {formatPrice(alert.condition_value)}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 -mt-1 -mr-1"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 px-4 pb-3 text-sm text-muted-foreground">
        <span>{formatTime(triggeredAt)}</span>
        <span className="text-green-400 font-medium">{formatPrice(triggerPrice)}</span>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4">
        {coachingInsight && (
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => setShowInsight(!showInsight)}
          >
            {showInsight ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide insight
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show coaching insight
              </>
            )}
          </Button>
        )}
      </div>

      {/* Coaching Insight (expanded) */}
      {showInsight && coachingInsight && (
        <div className="px-4 pb-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-primary font-medium mb-2">
              <Bot className="h-4 w-4" />
              Trading Coach Insight
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {coachingInsight}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Container for multiple toasts
interface AlertToastContainerProps {
  alerts: Array<{
    id: string;
    alert: Alert;
    triggerPrice: number;
    triggeredAt: Date;
    coachingInsight?: string;
    dismissed: boolean;
  }>;
  onDismiss: (id: string) => void;
}

export function AlertToastContainer({ alerts, onDismiss }: AlertToastContainerProps) {
  const visibleAlerts = alerts.filter(a => !a.dismissed).slice(0, 3);

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 w-96 space-y-3">
      {visibleAlerts.map(a => (
        <AlertToast
          key={a.id}
          alert={a.alert}
          triggerPrice={a.triggerPrice}
          triggeredAt={a.triggeredAt}
          coachingInsight={a.coachingInsight}
          onDismiss={() => onDismiss(a.id)}
        />
      ))}
    </div>
  );
}

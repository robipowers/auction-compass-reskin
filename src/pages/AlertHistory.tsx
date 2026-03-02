import { useState } from 'react';
import { ArrowLeft, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAlertHistory } from '@/hooks/use-alerts';
import { AlertPriority, INSTRUMENTS } from '@/types/alerts';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function AlertHistory() {
  const [instrumentFilter, setInstrumentFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: historyGroups = [], isLoading } = useAlertHistory({
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    instrument: instrumentFilter,
    priority: priorityFilter,
  });

  const priorityDots: Record<AlertPriority, string> = {
    critical: 'bg-red-400',
    important: 'bg-yellow-400',
    informational: 'bg-blue-400',
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/alerts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Alert History</h1>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-card rounded-lg border border-border">
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-[150px]"
          placeholder="From"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-[150px]"
          placeholder="To"
        />
        <Select value={instrumentFilter} onValueChange={setInstrumentFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Instrument" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Instruments</SelectItem>
            {INSTRUMENTS.map(i => (
              <SelectItem key={i.value} value={i.value}>{i.value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="important">Important</SelectItem>
            <SelectItem value="informational">Informational</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* History Groups */}
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading history...</div>
      ) : historyGroups.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground bg-card rounded-lg border border-border">
          No alert history found for the selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          {historyGroups.map(group => (
            <div key={group.sessionDate} className="bg-card rounded-lg border border-border overflow-hidden">
              {/* Session Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 border-b border-border">
                <span className="font-medium">{group.sessionLabel}</span>
                <span className="text-sm text-muted-foreground">
                  {group.alertCount} alert{group.alertCount !== 1 ? 's' : ''} fired
                </span>
              </div>

              {/* Alert Entries */}
              <div className="divide-y divide-border">
                {group.alerts.map(alert => (
                  <div 
                    key={alert.id}
                    className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span className={cn("w-2 h-2 rounded-full", priorityDots[alert.priority])} />
                        <Clock className="h-3 w-3" />
                        {formatTime(alert.triggered_at)}
                      </div>
                      <div className="font-medium mb-1">{alert.alert_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {alert.instrument} {alert.condition_direction === 'above' ? 'breaks above' : 
                         alert.condition_direction === 'below' ? 'breaks below' : 'crosses'} {formatPrice(alert.condition_value)}
                      </div>
                      {alert.coaching_insight && (
                        <div className="mt-2 p-3 bg-secondary/50 rounded-md text-sm text-muted-foreground">
                          <span className="text-primary font-medium">🤖 Insight:</span> {alert.coaching_insight}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <span className="text-lg font-semibold text-green-400">
                        {formatPrice(alert.trigger_price)}
                      </span>
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-3 w-3" />
                        View on Chart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

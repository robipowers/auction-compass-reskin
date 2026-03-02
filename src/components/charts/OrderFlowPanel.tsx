import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

type TabType = 'delta' | 'cumulative' | 'footprint';

interface DeltaBar {
  time: string;
  delta: number;
}

interface FootprintRow {
  price: number;
  bid: number;
  ask: number;
  imbalance?: 'bid' | 'ask';
}

interface OrderFlowPanelProps {
  className?: string;
}

// Mock data
const mockDeltaBars: DeltaBar[] = [
  { time: '09:30', delta: 450 },
  { time: '09:35', delta: 680 },
  { time: '09:40', delta: -320 },
  { time: '09:45', delta: 890 },
  { time: '09:50', delta: 420 },
  { time: '09:55', delta: -180 },
  { time: '10:00', delta: 1240 },
  { time: '10:05', delta: 560 },
];

const mockFootprint: FootprintRow[] = [
  { price: 18455, bid: 450, ask: 1240, imbalance: 'ask' },
  { price: 18450, bid: 680, ask: 720 },
  { price: 18445, bid: 1120, ask: 340, imbalance: 'bid' },
  { price: 18440, bid: 890, ask: 920 },
  { price: 18435, bid: 560, ask: 580 },
  { price: 18430, bid: 420, ask: 980, imbalance: 'ask' },
];

export function OrderFlowPanel({ className }: OrderFlowPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('cumulative');

  const cumulativeDelta = useMemo(() => {
    return mockDeltaBars.reduce((sum, bar) => sum + bar.delta, 0);
  }, []);

  const sessionDelta = useMemo(() => {
    return mockDeltaBars.slice(-4).reduce((sum, bar) => sum + bar.delta, 0);
  }, []);

  const maxAbsDelta = Math.max(...mockDeltaBars.map(b => Math.abs(b.delta)));

  return (
    <div className={cn("bg-card border border-border rounded-lg p-4", className)}>
      {/* Header with Tabs */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <h3 className="font-semibold">Order Flow Analysis</h3>
        <div className="flex gap-1">
          {(['delta', 'cumulative', 'footprint'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1 text-xs rounded transition-colors capitalize",
                activeTab === tab 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === 'cumulative' ? 'Cumulative Delta' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex gap-4">
        {/* Delta/Cumulative Chart */}
        <div className="flex-1 h-64 bg-background/50 rounded border border-border relative">
          {/* Zero line */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-border" />
          
          {/* Delta Bars */}
          <div className="absolute inset-4 flex items-end justify-around">
            {mockDeltaBars.map((bar, i) => {
              const height = (Math.abs(bar.delta) / maxAbsDelta) * 100;
              const isPositive = bar.delta >= 0;
              
              return (
                <div key={i} className="flex flex-col items-center w-6">
                  <span className="text-[10px] text-muted-foreground mb-1">
                    {bar.delta >= 0 ? '+' : ''}{bar.delta}
                  </span>
                  <div 
                    className={cn(
                      "w-5 rounded-t transition-all",
                      isPositive 
                        ? "bg-gradient-to-t from-green-500 to-green-400" 
                        : "bg-gradient-to-b from-red-500 to-red-400"
                    )}
                    style={{ 
                      height: `${height / 2}%`,
                      marginTop: isPositive ? 'auto' : 0,
                      marginBottom: isPositive ? 0 : 'auto',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footprint Table */}
        <div className="w-64 bg-background/50 rounded border border-border overflow-hidden">
          <div className="grid grid-cols-3 text-[11px] font-semibold text-center bg-secondary/50 border-b border-border py-2">
            <div>Bid</div>
            <div>Price</div>
            <div>Ask</div>
          </div>
          {mockFootprint.map((row, i) => (
            <div key={i} className="grid grid-cols-3 text-[11px] text-center border-b border-border py-1.5">
              <div className={cn(
                "text-red-400",
                row.imbalance === 'bid' && "bg-yellow-500/20"
              )}>
                {row.bid}
              </div>
              <div className="text-muted-foreground font-medium">{row.price.toLocaleString()}</div>
              <div className={cn(
                "text-green-400",
                row.imbalance === 'ask' && "bg-yellow-500/20"
              )}>
                {row.ask}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-8 mt-4 pt-3 border-t border-border">
        <div>
          <div className="text-xs text-muted-foreground">Cumulative Delta</div>
          <div className={cn(
            "text-lg font-semibold",
            cumulativeDelta >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {cumulativeDelta >= 0 ? '+' : ''}{cumulativeDelta.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Session Delta</div>
          <div className={cn(
            "text-lg font-semibold",
            sessionDelta >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {sessionDelta >= 0 ? '+' : ''}{sessionDelta.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Imbalances Detected</div>
          <div className="text-lg font-semibold">3</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Divergence Alert</div>
          <div className="text-lg font-semibold text-red-400">Bearish</div>
        </div>
      </div>
    </div>
  );
}

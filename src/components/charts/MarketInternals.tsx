import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InternalMetric {
  name: string;
  symbol: string;
  value: number;
  change: number;
  history: number[];
  extremeHigh?: number;
  extremeLow?: number;
}

interface MarketInternalsProps {
  className?: string;
}

// Generate random sparkline data
const generateSparkline = (current: number, range: number): number[] => {
  const data: number[] = [];
  let value = current - range / 2;
  for (let i = 0; i < 30; i++) {
    value += (Math.random() - 0.45) * (range / 10);
    data.push(value);
  }
  data[data.length - 1] = current; // End at current value
  return data;
};

// Mock initial data
const initialMetrics: InternalMetric[] = [
  {
    name: '$TICK',
    symbol: 'NYSE Tick',
    value: 485,
    change: 142,
    history: generateSparkline(485, 2000),
    extremeHigh: 1000,
    extremeLow: -1000,
  },
  {
    name: '$TRIN',
    symbol: 'Arms Index',
    value: 0.87,
    change: -0.12,
    history: generateSparkline(0.87, 1.5),
    extremeHigh: 2.0,
    extremeLow: 0.5,
  },
  {
    name: '$ADD',
    symbol: 'Advance-Decline',
    value: 1245,
    change: 356,
    history: generateSparkline(1245, 2500),
  },
  {
    name: 'VIX',
    symbol: 'Volatility',
    value: 14.82,
    change: -0.45,
    history: generateSparkline(14.82, 8),
    extremeHigh: 25,
    extremeLow: 12,
  },
];

function Sparkline({ data, color = 'blue', extremeHigh, extremeLow }: { 
  data: number[]; 
  color?: 'blue' | 'green' | 'red'; 
  extremeHigh?: number; 
  extremeLow?: number;
}) {
  const min = Math.min(...data, extremeLow ?? Infinity);
  const max = Math.max(...data, extremeHigh ?? -Infinity);
  const range = max - min || 1;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const lastValue = data[data.length - 1];
  const isExtreme = (extremeHigh && lastValue >= extremeHigh) || (extremeLow && lastValue <= extremeLow);

  return (
    <svg className="w-full h-10" viewBox="0 0 100 100" preserveAspectRatio="none">
      {/* Extreme zones */}
      {extremeHigh && (
        <rect 
          x="0" 
          y="0" 
          width="100" 
          height={((max - extremeHigh) / range) * 100} 
          fill="rgba(239, 68, 68, 0.1)" 
        />
      )}
      {extremeLow && (
        <rect 
          x="0" 
          y={100 - ((extremeLow - min) / range) * 100} 
          width="100" 
          height={((extremeLow - min) / range) * 100} 
          fill="rgba(34, 197, 94, 0.1)" 
        />
      )}
      
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={isExtreme ? '#ef4444' : color === 'green' ? '#22c55e' : '#3b82f6'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MarketInternals({ className }: MarketInternalsProps) {
  const [metrics, setMetrics] = useState<InternalMetric[]>(initialMetrics);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => {
        const movement = (Math.random() - 0.48) * (m.name === '$TRIN' ? 0.05 : m.name === 'VIX' ? 0.3 : 50);
        const newValue = m.value + movement;
        const newHistory = [...m.history.slice(1), newValue];
        
        return {
          ...m,
          value: Math.round(newValue * 100) / 100,
          change: Math.round((newValue - m.history[0]) * 100) / 100,
          history: newHistory,
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const isExtreme = (metric: InternalMetric) => {
    return (metric.extremeHigh && metric.value >= metric.extremeHigh) ||
           (metric.extremeLow && metric.value <= metric.extremeLow);
  };

  return (
    <div className={cn("bg-card border border-border rounded-lg p-4", className)}>
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Market Internals</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map(metric => {
          const extreme = isExtreme(metric);
          const isPositive = metric.change >= 0;
          
          return (
            <div 
              key={metric.name}
              onClick={() => setExpandedMetric(expandedMetric === metric.name ? null : metric.name)}
              className={cn(
                "bg-background/50 rounded-lg p-4 cursor-pointer transition-all border",
                extreme 
                  ? "border-yellow-500/50 bg-yellow-500/5" 
                  : "border-border hover:border-primary/30"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium">{metric.name}</div>
                  <div className="text-xs text-muted-foreground">{metric.symbol}</div>
                </div>
                {extreme && (
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-yellow-500/20 text-yellow-400 rounded">
                    EXTREME
                  </span>
                )}
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div className={cn(
                    "text-2xl font-bold",
                    extreme && (metric.change > 0 ? "text-green-400" : "text-red-400")
                  )}>
                    {metric.name === '$TRIN' || metric.name === 'VIX' 
                      ? metric.value.toFixed(2)
                      : Math.round(metric.value).toLocaleString()}
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm",
                    isPositive ? "text-green-400" : "text-red-400"
                  )}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {isPositive ? '+' : ''}{metric.name === '$TRIN' || metric.name === 'VIX' 
                      ? metric.change.toFixed(2)
                      : Math.round(metric.change)}
                  </div>
                </div>
                <div className="w-24">
                  <Sparkline 
                    data={metric.history} 
                    color={isPositive ? 'green' : 'blue'}
                    extremeHigh={metric.extremeHigh}
                    extremeLow={metric.extremeLow}
                  />
                </div>
              </div>

              {/* Expanded view */}
              {expandedMetric === metric.name && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="h-32">
                    <Sparkline 
                      data={metric.history}
                      extremeHigh={metric.extremeHigh}
                      extremeLow={metric.extremeLow}
                    />
                  </div>
                  {metric.extremeHigh && metric.extremeLow && (
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Extreme Low: {metric.extremeLow}</span>
                      <span>Extreme High: {metric.extremeHigh}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

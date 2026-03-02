import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface VolumeBar {
  price: number;
  volume: number;
  percentage: number;
}

interface VolumeProfileProps {
  data?: VolumeBar[];
  poc?: number;
  vah?: number;
  val?: number;
  period?: 'session' | 'day' | 'week';
  onPeriodChange?: (period: 'session' | 'day' | 'week') => void;
  className?: string;
}

// Mock volume profile data
const generateMockData = (basePrice: number): VolumeBar[] => {
  const bars: VolumeBar[] = [];
  const range = 80; // 80 point range
  const levels = 20;
  const step = range / levels;
  
  for (let i = 0; i < levels; i++) {
    const price = basePrice - 40 + i * step;
    // Bell curve distribution for volume
    const distanceFromCenter = Math.abs(i - levels / 2);
    const volume = Math.floor(1000 * Math.exp(-0.1 * distanceFromCenter * distanceFromCenter) + Math.random() * 300);
    bars.push({ price, volume, percentage: 0 });
  }
  
  // Calculate percentages
  const maxVolume = Math.max(...bars.map(b => b.volume));
  bars.forEach(bar => {
    bar.percentage = (bar.volume / maxVolume) * 100;
  });
  
  return bars;
};

export function VolumeProfile({ 
  data,
  poc = 18425,
  vah = 18450,
  val = 18390,
  period = 'session',
  onPeriodChange,
  className 
}: VolumeProfileProps) {
  const volumeData = useMemo(() => {
    return data || generateMockData(18425);
  }, [data]);

  const maxVolume = Math.max(...volumeData.map(d => d.volume));

  return (
    <div className={cn("bg-card border border-border rounded-lg p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <h3 className="font-semibold">Volume Profile (TPO)</h3>
        <div className="flex gap-1">
          {(['session', 'day', 'week'] as const).map(p => (
            <button
              key={p}
              onClick={() => onPeriodChange?.(p)}
              className={cn(
                "px-3 py-1 text-xs rounded transition-colors",
                period === p 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex gap-4">
        {/* Price Axis */}
        <div className="flex flex-col justify-between text-xs text-muted-foreground w-14">
          {volumeData.filter((_, i) => i % 4 === 0).reverse().map(bar => (
            <div key={bar.price}>{bar.price.toLocaleString()}</div>
          ))}
        </div>

        {/* Volume Bars */}
        <div className="flex-1 relative h-80 bg-background/50 rounded border border-border">
          {volumeData.map((bar, i) => {
            const isPoc = Math.abs(bar.price - poc) < 5;
            const isVah = Math.abs(bar.price - vah) < 5;
            const isVal = Math.abs(bar.price - val) < 5;
            
            return (
              <div
                key={bar.price}
                className="absolute right-0 h-[4.5%] flex items-center"
                style={{ bottom: `${(i / volumeData.length) * 100}%` }}
              >
                {/* Volume bar */}
                <div
                  className={cn(
                    "h-full border-l-2 transition-all",
                    isPoc 
                      ? "bg-yellow-500/40 border-yellow-500" 
                      : "bg-blue-500/30 border-blue-500"
                  )}
                  style={{ width: `${bar.percentage}%` }}
                />
                
                {/* Level labels */}
                {isPoc && (
                  <span className="absolute right-full mr-2 px-2 py-0.5 text-[10px] font-medium bg-yellow-500 text-black rounded">
                    POC {poc.toLocaleString()}
                  </span>
                )}
                {isVah && (
                  <span className="absolute right-full mr-2 px-2 py-0.5 text-[10px] font-medium bg-green-500 text-black rounded">
                    VAH {vah.toLocaleString()}
                  </span>
                )}
                {isVal && (
                  <span className="absolute right-full mr-2 px-2 py-0.5 text-[10px] font-medium bg-green-500 text-black rounded">
                    VAL {val.toLocaleString()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-yellow-500" />
          <span className="text-muted-foreground">POC (Point of Control)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-green-500" />
          <span className="text-muted-foreground">Value Area (70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 bg-blue-500/30" />
          <span className="text-muted-foreground">Volume Distribution</span>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { useMarketData } from "@/contexts/MarketDataContext";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const ScenarioProximityBar: React.FC<{ className?: string }> = ({ className }) => {
  const { marketData } = useMarketData();

  if (!marketData) return null;

  const { currentPrice, valueAreaHigh, valueAreaLow, poc } = marketData;

  const inValueArea = currentPrice >= valueAreaLow && currentPrice <= valueAreaHigh;
  const aboveValueArea = currentPrice > valueAreaHigh;
  const atPOC = Math.abs(currentPrice - poc) < 2; // Within 2 ticks

  const getMarketState = () => {
    if (atPOC) return { label: 'At POC', color: 'text-yellow-400', icon: Minus };
    if (aboveValueArea) return { label: 'Above VA', color: 'text-green-400', icon: TrendingUp };
    if (!inValueArea) return { label: 'Below VA', color: 'text-red-400', icon: TrendingDown };
    return { label: 'In VA', color: 'text-primary', icon: Minus };
  };

  const state = getMarketState();
  const Icon = state.icon;

  // Calculate position percentage within value area
  const vaRange = valueAreaHigh - valueAreaLow;
  const position = vaRange > 0
    ? Math.min(100, Math.max(0, ((currentPrice - valueAreaLow) / vaRange) * 100))
    : 50;

  return (
    <div className={cn('flex items-center gap-3 px-3 py-2 bg-card border rounded-md', className)}>
      <div className='flex items-center gap-1.5'>
        <Icon className={cn('h-3.5 w-3.5', state.color)} />
        <span className={cn('text-xs font-medium', state.color)}>{state.label}</span>
      </div>
      
      <div className='flex-1 relative h-1.5 bg-secondary rounded-full overflow-hidden'>
        {/* Value Area range */}
        <div
          className='absolute inset-y-0 bg-primary/20'
          style={{ left: '0%', right: '0%' }}
        />
        {/* POC line */}
        <div
          className='absolute inset-y-0 w-0.5 bg-yellow-400/70'
          style={{ left: `${((poc - valueAreaLow) / vaRange) * 100}%` }}
        />
        {/* Current price indicator */}
        <div
          className='absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-glow'
          style={{ left: `${position}%`, transform: 'translateX(-50%) translateY(-50%)' }}
        />
      </div>

      <div className='text-xs text-muted-foreground font-mono'>
        {currentPrice.toFixed(2)}
      </div>
    </div>
  );
};

import { 
  BookOpen, 
  Target, 
  Scale, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  Lightbulb,
  Layers,
  Activity,
  LineChart,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Map topic slugs or names to proper Lucide icons
const iconMap: Record<string, LucideIcon> = {
  // By slug
  'fundamentals': BookOpen,
  'value-area-poc': Target,
  'balance-imbalance': Scale,
  'initiative-responsive': Zap,
  'inventory-risk': TrendingUp,
  'market-structure': BarChart3,
  'advanced-concepts': Lightbulb,
  // By name (fallback)
  'Fundamentals': BookOpen,
  'Value Area & POC': Target,
  'Balance & Imbalance': Scale,
  'Initiative & Responsive': Zap,
  'Inventory & Risk': TrendingUp,
  'Market Structure': BarChart3,
  'Advanced Concepts': Lightbulb,
  // Generic fallback
  'all': Layers,
};

interface TopicIconProps {
  slug?: string;
  name?: string;
  className?: string;
  isSelected?: boolean;
}

export function TopicIcon({ slug, name, className, isSelected }: TopicIconProps) {
  const Icon = iconMap[slug || ''] || iconMap[name || ''] || Activity;
  
  return (
    <div className={cn(
      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
      isSelected 
        ? "bg-primary text-primary-foreground" 
        : "bg-secondary/80 text-muted-foreground",
      className
    )}>
      <Icon className="h-4 w-4" />
    </div>
  );
}

// Simpler inline version that returns just the icon
export function getTopicIcon(slug?: string, name?: string): LucideIcon {
  return iconMap[slug || ''] || iconMap[name || ''] || Activity;
}

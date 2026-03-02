import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EMOTIONS, Emotion, EmotionCategory } from '@/types/journal';



const CATEGORY_COLORS: Record<EmotionCategory, { bg: string; border: string; text: string }> = {
  positive: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  negative: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  neutral: { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400' },
};

interface EmotionSelectorProps {
  label: string;
  selected: Emotion[];
  onChange: (emotions: Emotion[]) => void;
  className?: string;
}

export function EmotionSelector({ label, selected, onChange, className }: EmotionSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleEmotion = (emotion: Emotion) => {
    if (selected.includes(emotion)) {
      onChange(selected.filter(e => e !== emotion));
    } else {
      onChange([...selected, emotion]);
    }
  };

  const getCategory = (emotion: Emotion): EmotionCategory => {
    if ((EMOTIONS.positive as readonly string[]).includes(emotion)) return 'positive';
    if ((EMOTIONS.negative as readonly string[]).includes(emotion)) return 'negative';
    return 'neutral';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? 'Collapse' : 'Show all'}
        </button>
      </div>
      
      {/* Selected emotions */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(emotion => {
            const category = getCategory(emotion);
            const colors = CATEGORY_COLORS[category];
            return (
              <Badge
                key={emotion}
                variant="outline"
                className={cn(
                  'cursor-pointer transition-all',
                  colors.bg,
                  colors.border,
                  colors.text,
                  'hover:opacity-80'
                )}
                onClick={() => toggleEmotion(emotion)}
              >
                {emotion}
                <span className="ml-1 opacity-60">×</span>
              </Badge>
            );
          })}
        </div>
      )}
      
      {/* Emotion picker */}
      {isExpanded && (
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-3">
          {(Object.entries(EMOTIONS) as [EmotionCategory, readonly Emotion[]][]).map(([category, emotions]) => {
            const colors = CATEGORY_COLORS[category];
            return (
              <div key={category}>
                <p className={cn('text-xs font-medium mb-1.5 capitalize', colors.text)}>
                  {category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {emotions.map(emotion => {
                    const isSelected = selected.includes(emotion);
                    return (
                      <Badge
                        key={emotion}
                        variant="outline"
                        className={cn(
                          'cursor-pointer transition-all',
                          isSelected 
                            ? cn(colors.bg, colors.border, colors.text)
                            : 'bg-background/50 border-border/50 text-muted-foreground hover:border-border',
                        )}
                        onClick={() => toggleEmotion(emotion)}
                      >
                        {emotion}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Quick add for empty state */}
      {!isExpanded && selected.length === 0 && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-full py-2 rounded-md border border-dashed border-border/50 text-sm text-muted-foreground hover:border-border hover:text-foreground transition-colors"
        >
          + Add emotions
        </button>
      )}
    </div>
  );
}

export default EmotionSelector;

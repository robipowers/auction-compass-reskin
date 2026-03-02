import { useState, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { useKnowledge } from '@/contexts/KnowledgeContext';
import { useKnowledgeArticle } from '@/hooks/use-knowledge';
import { AMTGlossaryTerm } from '@/types/knowledge';
import { cn } from '@/lib/utils';

interface GlossaryTooltipProps {
  term: AMTGlossaryTerm;
  children: ReactNode;
  className?: string;
}

export function GlossaryTooltip({ term, children, className }: GlossaryTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { openSidebar } = useKnowledge();
  const { data: linkedArticle } = useKnowledgeArticle(
    term.article_id ? '' : '' // Only fetch if clicked
  );

  const handleLearnMore = async () => {
    if (term.article_id) {
      // Fetch the linked article and open sidebar
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: article } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('id', term.article_id)
        .single();
      
      if (article) {
        openSidebar(article);
      }
    }
    setIsVisible(false);
  };

  return (
    <span
      className={cn(
        "relative inline-block cursor-help",
        className
      )}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Term text with styling */}
      <span className="text-primary border-b border-dotted border-primary/50 hover:border-primary transition-colors">
        {children}
      </span>

      {/* Tooltip */}
      {isVisible && (
        <div 
          className="absolute bottom-full left-0 mb-2 z-50 w-72 p-4 rounded-lg bg-card border border-border shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          {/* Arrow */}
          <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-primary" />
          
          <h4 className="text-sm font-semibold text-primary mb-2">{term.term}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {term.definition}
          </p>
          
          {term.article_id && (
            <button
              onClick={handleLearnMore}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Learn more
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </span>
  );
}

// Simplified version without full tooltip
export function AMTTerm({ 
  children, 
  onClick 
}: { 
  children: ReactNode; 
  onClick?: () => void; 
}) {
  return (
    <span 
      className="text-primary border-b border-dotted border-primary/50 hover:border-primary cursor-pointer transition-colors"
      onClick={onClick}
    >
      {children}
    </span>
  );
}

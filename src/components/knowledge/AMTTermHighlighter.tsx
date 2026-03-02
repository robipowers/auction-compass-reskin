import { useMemo } from 'react';
import { GlossaryTooltip } from './GlossaryTooltip';
import { useKnowledge } from '@/contexts/KnowledgeContext';

interface AMTTermHighlighterProps {
  text: string;
  className?: string;
}

export function AMTTermHighlighter({ text, className }: AMTTermHighlighterProps) {
  const { glossaryTerms } = useKnowledge();

  const segments = useMemo(() => {
    if (!glossaryTerms.length) return [{ text, isterm: false }];

    // Build a regex that matches any glossary term (case insensitive)
    const termPattern = glossaryTerms
      .map(t => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .sort((a, b) => b.length - a.length) // Match longer terms first
      .join('|');
    
    const regex = new RegExp(`(${termPattern})`, 'gi');
    const parts = text.split(regex);

    return parts.map(part => ({
      text: part,
      isTerm: glossaryTerms.some(
        t => t.term.toLowerCase() === part.toLowerCase()
      )
    }));
  }, [text, glossaryTerms]);

  return (
    <span className={className}>
      {segments.map((segment, i) =>
        segment.isTerm ? (
          <GlossaryTooltip key={i} term={segment.text}>
            <span className="border-b border-dotted border-primary/50 cursor-help">
              {segment.text}
            </span>
          </GlossaryTooltip>
        ) : (
          <span key={i}>{segment.text}</span>
        )
      )}
    </span>
  );
}

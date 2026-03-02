import { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { glossary, GlossaryTerm } from '@/data/amt-knowledge-glossary-learning';

export function GlossaryTab() {
  const [search, setSearch] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  const filteredTerms = search.length >= 2
    ? glossary.filter(t => 
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase())
      )
    : glossary;

  // Group by first letter
  const grouped = filteredTerms.reduce((acc, term) => {
    const letter = term.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {} as Record<string, GlossaryTerm[]>);

  return (
    <div className="flex gap-6">
      {/* Term List */}
      <div className="w-80 shrink-0">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-4 pr-4">
            {Object.entries(grouped).sort().map(([letter, terms]) => (
              <div key={letter}>
                <div className="text-xs font-semibold text-primary mb-2">{letter}</div>
                <div className="space-y-1">
                  {terms.map((term) => (
                    <button
                      key={term.slug}
                      onClick={() => setSelectedTerm(term)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedTerm?.slug === term.slug
                          ? 'bg-primary/15 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {term.term}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Term Detail */}
      <div className="flex-1">
        {selectedTerm ? (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedTerm.term}</h2>
              <p className="text-foreground/90 text-lg mb-6">{selectedTerm.definition}</p>
              
              {selectedTerm.related_terms && selectedTerm.related_terms.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">Related Terms</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.related_terms.map((rt) => (
                      <Badge 
                        key={rt} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-primary/20"
                        onClick={() => {
                          const found = glossary.find(t => t.term === rt);
                          if (found) setSelectedTerm(found);
                        }}
                      >
                        {rt}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedTerm.see_also && selectedTerm.see_also.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">See Also (Articles)</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.see_also.map((slug) => (
                      <Badge key={slug} variant="outline">
                        {slug.replace(/-/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a term to see its definition</p>
            <p className="text-sm mt-1">{glossary.length} terms available</p>
          </div>
        )}
      </div>
    </div>
  );
}

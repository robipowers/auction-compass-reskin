import { useState, useEffect, useRef } from 'react';
import { Clock, Bookmark, BookmarkCheck, ChevronUp, Share2, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { KnowledgeArticle } from '@/types/knowledge';
import { glossary } from '@/data/amt-knowledge-glossary-learning';

interface PremiumArticleViewProps {
  article: KnowledgeArticle;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export function PremiumArticleView({ article, isBookmarked, onToggleBookmark }: PremiumArticleViewProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
      setShowScrollTop(scrollTop > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headings = extractHeadings(article.content);

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-background/50">
        <div className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>
      <div className="relative mb-8 -mx-6 px-6 py-10 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-blue-500/5 border border-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl" />
        <div className="relative z-10">
          {article.topic && (
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">{article.topic.name}</Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full text-sm">
              <Clock className="h-4 w-4 text-primary" />{article.read_time_minutes} min read
            </span>
            <Button variant="ghost" size="sm" className={cn("gap-2 rounded-full", isBookmarked && "text-yellow-500")} onClick={onToggleBookmark}>
              {isBookmarked ? <BookmarkCheck className="h-4 w-4 fill-current" /> : <Bookmark className="h-4 w-4" />}
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-8">
        <div className="flex-1 min-w-0" ref={contentRef}>
          <div className="article-content" dangerouslySetInnerHTML={{ __html: formatPremiumMarkdown(article.content) }} />
          <Card className="mt-12 p-6 bg-gradient-to-br from-green-500/10 to-primary/5 border-green-500/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center"><CheckCircle className="h-6 w-6 text-green-400" /></div>
              <div><h3 className="font-semibold text-lg">Article Complete!</h3><p className="text-muted-foreground text-sm">You've finished reading "{article.title}"</p></div>
            </div>
          </Card>
        </div>
        {headings.length > 2 && (
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">On This Page</h4>
              <nav className="space-y-2">
                {headings.map((heading, i) => (
                  <a key={i} href={`#${heading.slug}`} className={cn("block text-sm transition-colors py-1", heading.level === 2 ? "pl-0" : "pl-3 text-xs", activeSection === heading.slug ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground")}>
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
      <Button variant="secondary" size="icon" className={cn("fixed bottom-6 right-6 z-40 rounded-full shadow-lg transition-all duration-300", showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none")} onClick={scrollToTop}>
        <ChevronUp className="h-5 w-5" />
      </Button>
      <style>{`
        .article-content { font-size: 1.1rem; line-height: 1.8; color: hsl(var(--foreground) / 0.9); }
        .article-content h1 { font-size: 2rem; font-weight: 700; margin-top: 3rem; margin-bottom: 1.5rem; color: hsl(var(--foreground)); padding-bottom: 0.75rem; border-bottom: 2px solid hsl(var(--primary) / 0.2); }
        .article-content h2 { font-size: 1.5rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1rem; color: hsl(var(--foreground)); display: flex; align-items: center; gap: 0.75rem; }
        .article-content h2::before { content: ''; width: 4px; height: 1.5rem; background: linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--primary) / 0.5)); border-radius: 2px; }
        .article-content h3 { font-size: 1.25rem; font-weight: 500; margin-top: 2rem; margin-bottom: 0.75rem; color: hsl(var(--foreground)); }
        .article-content p { margin-bottom: 1.25rem; }
        .article-content ul, .article-content ol { margin: 1.5rem 0; padding-left: 0; }
        .article-content li { position: relative; padding-left: 1.75rem; margin-bottom: 0.75rem; list-style: none; }
        .article-content ul li::before { content: ''; position: absolute; left: 0; top: 0.6rem; width: 8px; height: 8px; background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.6)); border-radius: 50%; }
        .article-content ol { counter-reset: list-counter; }
        .article-content ol li::before { counter-increment: list-counter; content: counter(list-counter); position: absolute; left: 0; top: 0; width: 1.5rem; height: 1.5rem; background: hsl(var(--primary) / 0.15); color: hsl(var(--primary)); font-size: 0.8rem; font-weight: 600; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .article-content strong { color: hsl(var(--foreground)); font-weight: 600; }
        .article-content em { color: hsl(var(--primary) / 0.9); font-style: italic; }
        .article-content blockquote, .article-content .callout { margin: 2rem 0; padding: 1.25rem 1.5rem; background: linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--primary) / 0.03)); border-left: 4px solid hsl(var(--primary)); border-radius: 0 12px 12px 0; font-style: normal; }
        .article-content blockquote p:last-child, .article-content .callout p:last-child { margin-bottom: 0; }
        .article-content code { background: hsl(var(--secondary)); padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.9em; font-family: 'JetBrains Mono', monospace; }
        .article-content pre { background: hsl(var(--secondary)); padding: 1.25rem; border-radius: 12px; overflow-x: auto; margin: 1.5rem 0; }
        .article-content pre code { background: none; padding: 0; }
        .article-content hr { border: none; height: 1px; background: linear-gradient(to right, transparent, hsl(var(--border)), transparent); margin: 3rem 0; }
        .article-content .key-term { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.1em 0.5em; background: hsl(var(--primary) / 0.1); color: hsl(var(--primary)); border-radius: 4px; font-weight: 500; cursor: help; border-bottom: 1px dashed hsl(var(--primary) / 0.5); }
        .article-content .example-box { margin: 2rem 0; padding: 1.5rem; background: hsl(var(--secondary) / 0.5); border: 1px solid hsl(var(--border)); border-radius: 12px; }
        .article-content .example-box::before { content: '📊 Example'; display: block; font-weight: 600; font-size: 0.875rem; color: hsl(var(--muted-foreground)); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
      `}</style>
    </div>
  );
}

function extractHeadings(content: string): { text: string; slug: string; level: number }[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: { text: string; slug: string; level: number }[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    if (level <= 3) headings.push({ text, slug, level });
  }
  return headings;
}

function formatPremiumMarkdown(content: string): string {
  const glossaryTerms = glossary.map(t => t.term);
  let html = content
    .replace(/^# (.+)$/gm, (_, text) => { const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'); return `<h1 id="${slug}">${text}</h1>`; })
    .replace(/^## (.+)$/gm, (_, text) => { const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'); return `<h2 id="${slug}">${text}</h2>`; })
    .replace(/^### (.+)$/gm, (_, text) => { const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'); return `<h3 id="${slug}">${text}</h3>`; })
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^>\s*(.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => { if (match.includes('<li>1.')) return `<ol>${match}</ol>`; return `<ul>${match}</ul>`; })
    .replace(/^---$/gm, '<hr>')
    .replace(/^(?!<[huo]|<li|<pre|<block|<hr)(.+)$/gm, '<p>$1</p>')
    .replace(/<p>\s*<\/p>/g, '');
  return html;
}

export default PremiumArticleView;

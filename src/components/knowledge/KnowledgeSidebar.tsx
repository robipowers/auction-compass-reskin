import { useEffect } from 'react';
import { X, Bookmark, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useKnowledge } from '@/contexts/KnowledgeContext';
import { useBookmarks, useToggleBookmark, useMarkAsRead } from '@/hooks/use-knowledge';
import { cn } from '@/lib/utils';

export function KnowledgeSidebar() {
  const { isSidebarOpen, currentArticle, closeSidebar } = useKnowledge();
  const { data: bookmarks } = useBookmarks();
  const toggleBookmark = useToggleBookmark();
  const markAsRead = useMarkAsRead();

  const isBookmarked = bookmarks?.some(b => b.article_id === currentArticle?.id) ?? false;

  // Mark as read when article is viewed
  useEffect(() => {
    if (currentArticle && isSidebarOpen) {
      markAsRead.mutate({ 
        articleId: currentArticle.id, 
        version: currentArticle.version 
      });
    }
  }, [currentArticle?.id, isSidebarOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSidebarOpen, closeSidebar]);

  const handleBookmarkClick = () => {
    if (currentArticle) {
      toggleBookmark.mutate({ 
        articleId: currentArticle.id, 
        isBookmarked 
      });
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background/70 backdrop-blur-sm z-40 transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
      />

      {/* Sidebar Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-background border-l border-border z-50 shadow-xl transition-transform duration-300 ease-out",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold truncate pr-2">
            {currentArticle?.title ?? 'Knowledge Base'}
          </h2>
          <Button variant="ghost" size="icon" onClick={closeSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Meta bar */}
        {currentArticle && (
          <div className="flex items-center gap-4 px-4 py-3 border-b border-border text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {currentArticle.read_time_minutes} min read
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmarkClick}
              className={cn(
                "gap-1 h-8",
                isBookmarked && "text-yellow-500"
              )}
            >
              <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
          </div>
        )}

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-4">
            {currentArticle ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <div 
                  className="whitespace-pre-wrap text-foreground/90 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMarkdown(currentArticle.content) 
                  }} 
                />
                
                {/* Related Articles placeholder */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-base font-semibold mb-4 text-foreground">Related Articles</h3>
                  <div className="space-y-2">
                    <button className="flex items-center gap-2 w-full text-left p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors text-sm">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Point of Control Explained</span>
                    </button>
                    <button className="flex items-center gap-2 w-full text-left p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors text-sm">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Balance vs Imbalance</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <p>Select an article to read</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

// Simple markdown formatter
function formatMarkdown(content: string): string {
  return content
    .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mt-6 mb-3 text-foreground">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mt-5 mb-2 text-foreground">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-base font-medium mt-4 mb-2 text-foreground">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\n\n/g, '</p><p class="mt-3">')
    .replace(/^(.+)$/gm, '<p class="mt-3">$1</p>');
}

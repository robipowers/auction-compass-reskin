// Updated Knowledge.tsx with Glossary and Learning Path tabs
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Bookmark, History, Clock, ChevronRight, CheckCircle, ArrowLeft, GraduationCap, BookText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useKnowledgeTopics, useKnowledgeArticles, useKnowledgeSearch, useBookmarks, useReadingHistory, useMarkAsRead } from '@/hooks/use-knowledge';
import { KnowledgeArticle, KnowledgeTopic } from '@/types/knowledge';
import { cn } from '@/lib/utils';
import { GlossaryTab, LearningPathTab, PremiumArticleView, TopicIcon } from '@/components/knowledge';

type FilterTab = 'all' | 'bookmarked' | 'history';
type MainTab = 'articles' | 'glossary' | 'learning';

export default function Knowledge() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState<MainTab>('articles');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  const { data: topics = [], isLoading: topicsLoading } = useKnowledgeTopics();
  const { data: articles = [], isLoading: articlesLoading } = useKnowledgeArticles(selectedTopic ?? undefined);
  const { data: searchResults = [] } = useKnowledgeSearch(searchQuery);
  const { data: bookmarks = [] } = useBookmarks();
  const { data: readingHistory = [] } = useReadingHistory();
  const markAsRead = useMarkAsRead();

  const bookmarkedIds = new Set(bookmarks.map(b => b.article_id));
  const readArticleIds = new Set(readingHistory.map(h => h.article_id));

  const displayedArticles =
    searchQuery.length >= 2 ? searchResults :
    filterTab === 'bookmarked' ? articles.filter(a => bookmarkedIds.has(a.id)) :
    filterTab === 'history' ? articles.filter(a => readArticleIds.has(a.id)) :
    articles;

  const totalArticles = articles.length;
  const readCount = articles.filter(a => readArticleIds.has(a.id)).length;
  const progressPercent = totalArticles > 0 ? Math.round((readCount / totalArticles) * 100) : 0;

  const handleArticleClick = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    markAsRead.mutate({ articleId: article.id, version: article.version });
  };

  const handleLearningPathArticleClick = (articleSlug: string) => {
    const article = articles.find(a => a.slug === articleSlug);
    if (article) {
      setMainTab("articles");
      setSelectedArticle(article);
      markAsRead.mutate({ articleId: article.id, version: article.version });
    }
  };

  if (selectedArticle) {
    return (
      <div className="container py-8">
        <Button variant="ghost" className="mb-6 -ml-2" onClick={() => setSelectedArticle(null)}>
          <ArrowLeft className="h-4 w-4 mr-2" />Back to Knowledge Base
        </Button>
        <PremiumArticleView
          article={selectedArticle}
          isBookmarked={bookmarkedIds.has(selectedArticle.id)}
          onToggleBookmark={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
        <p className="text-muted-foreground mt-2">Master Auction Market Theory with curated articles, glossary, and learning paths</p>
      </div>

      <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as MainTab)}>
        <TabsList className="mb-6">
          <TabsTrigger value="articles" className="flex items-center gap-2"><BookOpen className="h-4 w-4" />Articles</TabsTrigger>
          <TabsTrigger value="glossary" className="flex items-center gap-2"><BookText className="h-4 w-4" />Glossary</TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-2"><GraduationCap className="h-4 w-4" />Learning Path</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-64 shrink-0">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search articles..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex gap-2 mb-4">
                {(['all', 'bookmarked', 'history'] as FilterTab[]).map(tab => (
                  <Button key={tab} variant={filterTab === tab ? 'default' : 'ghost'} size="sm" className="flex-1" onClick={() => setFilterTab(tab)}>
                    {tab === 'all' && <BookOpen className="h-3.5 w-3.5 mr-1" />}
                    {tab === 'bookmarked' && <Bookmark className="h-3.5 w-3.5 mr-1" />}
                    {tab === 'history' && <History className="h-3.5 w-3.5 mr-1" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Button>
                ))}
              </div>
              {!searchQuery && (
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-1 pr-2">
                    <button className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors", !selectedTopic ? "bg-primary text-primary-foreground" : "hover:bg-secondary")} onClick={() => setSelectedTopic(null)}>All Topics</button>
                    {topics.map(topic => (
                      <button key={topic.id} className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2", selectedTopic === topic.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary")} onClick={() => setSelectedTopic(topic.id)}>
                        <TopicIcon icon={topic.icon} className="h-4 w-4" />{topic.name}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </aside>
            <main className="flex-1">
              {totalArticles > 0 && !searchQuery && (
                <div className="mb-6 p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Reading Progress</span>
                    <span className="text-xs text-muted-foreground">{readCount} / {totalArticles} articles</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              )}
              {articlesLoading ? (
                <div className="grid gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-secondary animate-pulse" />)}</div>
              ) : displayedArticles.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground"><BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" /><p>No articles found</p></div>
              ) : (
                <div className="grid gap-3">
                  {displayedArticles.map(article => (
                    <Card key={article.id} className="cursor-pointer hover:border-primary/40 transition-all duration-200 group" onClick={() => handleArticleClick(article)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {readArticleIds.has(article.id) && <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />}
                              <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{article.title}</h3>
                            </div>
                            {article.summary && <p className="text-xs text-muted-foreground line-clamp-2">{article.summary}</p>}
                            <div className="flex items-center gap-3 mt-2">
                              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{article.read_time_minutes}m</span>
                              {article.topic && <Badge variant="secondary" className="text-xs py-0">{article.topic.name}</Badge>}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </main>
          </div>
        </TabsContent>

        <TabsContent value="glossary"><GlossaryTab /></TabsContent>
        <TabsContent value="learning"><LearningPathTab onArticleClick={handleLearningPathArticleClick} /></TabsContent>
      </Tabs>
    </div>
  );
}

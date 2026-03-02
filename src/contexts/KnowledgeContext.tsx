import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { KnowledgeArticle, KnowledgeTopic, GlossaryTerm } from '@/types/knowledge';

interface KnowledgeContextType {
  articles: KnowledgeArticle[];
  topics: KnowledgeTopic[];
  glossaryTerms: GlossaryTerm[];
  isLoading: boolean;
  searchArticles: (query: string) => Promise<KnowledgeArticle[]>;
  getArticlesByTopic: (topicId: string) => KnowledgeArticle[];
  getGlossaryTerm: (term: string) => GlossaryTerm | undefined;
}

const KnowledgeContext = createContext<KnowledgeContextType | undefined>(undefined);

export const KnowledgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [topics, setTopics] = useState<KnowledgeTopic[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadKnowledgeBase = async () => {
      try {
        const [topicsRes, articlesRes, glossaryRes] = await Promise.all([
          supabase.from('knowledge_topics').select('*'),
          supabase.from('knowledge_articles').select('*, knowledge_topics(*)'),
          supabase.from('glossary_terms').select('*'),
        ]);

        if (topicsRes.data) setTopics(topicsRes.data as KnowledgeTopic[]);
        if (articlesRes.data) setArticles(articlesRes.data as unknown as KnowledgeArticle[]);
        if (glossaryRes.data) setGlossaryTerms(glossaryRes.data as GlossaryTerm[]);
      } catch (error) {
        console.error('Failed to load knowledge base:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadKnowledgeBase();
  }, []);

  const searchArticles = async (query: string): Promise<KnowledgeArticle[]> => {
    if (!query.trim()) return articles;
    const { data } = await supabase
      .from('knowledge_articles')
      .select('*, knowledge_topics(*)')
      .textSearch('title', query);
    return (data as unknown as KnowledgeArticle[]) || [];
  };

  const getArticlesByTopic = (topicId: string) =>
    articles.filter(a => a.topic_id === topicId);

  const getGlossaryTerm = (term: string) =>
    glossaryTerms.find(g => g.term.toLowerCase() === term.toLowerCase());

  return (
    <KnowledgeContext.Provider value={{
      articles, topics, glossaryTerms, isLoading,
      searchArticles, getArticlesByTopic, getGlossaryTerm
    }}>
      {children}
    </KnowledgeContext.Provider>
  );
};

export const useKnowledge = () => {
  const context = useContext(KnowledgeContext);
  if (!context) throw new Error('useKnowledge must be used within KnowledgeProvider');
  return context;
};

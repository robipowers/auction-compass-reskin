// Knowledge Base Types

export interface KnowledgeTopic {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  topic_id: string;
  topic?: KnowledgeTopic;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  related_concepts?: string[];
  created_at: string;
  updated_at: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  example?: string;
  related_terms?: string[];
  topic_id?: string;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  articles: string[]; // article IDs in order
  estimated_time?: string;
}

export interface SearchResult {
  article: KnowledgeArticle;
  score: number;
  highlights?: string[];
}

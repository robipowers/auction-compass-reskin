-- Migration: Enhanced Knowledge Base
-- Creates tables for AMT knowledge articles, topics, user progress, and glossary

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Knowledge topics (categories)
CREATE TABLE knowledge_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_knowledge_topics_sort ON knowledge_topics(sort_order);

-- Knowledge articles
CREATE TABLE knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  topic_id UUID REFERENCES knowledge_topics(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  read_time_minutes INTEGER DEFAULT 5,
  version INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_knowledge_articles_topic ON knowledge_articles(topic_id);
CREATE INDEX idx_knowledge_articles_slug ON knowledge_articles(slug);

-- User reading history
CREATE TABLE knowledge_reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES knowledge_articles(id) ON DELETE CASCADE,
  article_version INTEGER,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id, article_version)
);

CREATE INDEX idx_knowledge_reading_history_user ON knowledge_reading_history(user_id);
CREATE INDEX idx_knowledge_reading_history_article ON knowledge_reading_history(article_id);

-- User bookmarks
CREATE TABLE knowledge_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES knowledge_articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

CREATE INDEX idx_knowledge_bookmarks_user ON knowledge_bookmarks(user_id);

-- User notes on articles
CREATE TABLE knowledge_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES knowledge_articles(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_knowledge_notes_user ON knowledge_notes(user_id);
CREATE INDEX idx_knowledge_notes_article ON knowledge_notes(article_id);

-- AMT glossary terms
CREATE TABLE amt_glossary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT UNIQUE NOT NULL,
  definition TEXT NOT NULL,
  article_id UUID REFERENCES knowledge_articles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_amt_glossary_term ON amt_glossary(term);

-- Enable Row Level Security
ALTER TABLE knowledge_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE amt_glossary ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read topics" ON knowledge_topics FOR SELECT USING (true);
CREATE POLICY "Anyone can read articles" ON knowledge_articles FOR SELECT USING (true);
CREATE POLICY "Anyone can read glossary" ON amt_glossary FOR SELECT USING (true);

CREATE POLICY "Users can read own reading history" ON knowledge_reading_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reading history" ON knowledge_reading_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own bookmarks" ON knowledge_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON knowledge_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON knowledge_bookmarks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own notes" ON knowledge_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON knowledge_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON knowledge_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON knowledge_notes FOR DELETE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_knowledge_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_knowledge_articles_updated_at BEFORE UPDATE ON knowledge_articles FOR EACH ROW EXECUTE FUNCTION update_knowledge_updated_at();
CREATE TRIGGER trigger_knowledge_notes_updated_at BEFORE UPDATE ON knowledge_notes FOR EACH ROW EXECUTE FUNCTION update_knowledge_updated_at();

-- Seed topics
INSERT INTO knowledge_topics (name, slug, icon, description, sort_order) VALUES
  ('Fundamentals', 'fundamentals', '📊', 'Core AMT concepts', 1),
  ('Value Area & POC', 'value-area-poc', '📈', 'Value area and point of control', 2),
  ('Balance & Imbalance', 'balance-imbalance', '⚖️', 'Market balance states', 3),
  ('Initiative & Responsive', 'initiative-responsive', '🎯', 'Trading activity types', 4),
  ('Inventory & Risk', 'inventory-risk', '📉', 'Position management', 5),
  ('Market Structure', 'market-structure', '🔄', 'Structural patterns', 6),
  ('Advanced Concepts', 'advanced-concepts', '💡', 'Advanced strategies', 7);

-- Seed glossary terms
INSERT INTO amt_glossary (term, definition) VALUES
  ('Value Area', 'The price range where approximately 70% of trading volume occurs.'),
  ('Value Area High', 'The upper boundary of the value area.'),
  ('Value Area Low', 'The lower boundary of the value area.'),
  ('POC', 'Point of Control - the price level with the highest trading volume.'),
  ('Point of Control', 'The single price level with the highest trading volume.'),
  ('Balance', 'A market state where trading is two-sided within a range.'),
  ('Imbalance', 'A market state where one side dominates.'),
  ('Initiative', 'Trading activity that moves price away from value.'),
  ('Responsive', 'Trading activity that responds to perceived unfair prices.'),
  ('Acceptance', 'When price finds two-sided trade at a new level.'),
  ('Rejection', 'Quick reversal from a price level.'),
  ('Initial Balance', 'The price range established during the first hour.'),
  ('VAH', 'Value Area High - the upper boundary.'),
  ('VAL', 'Value Area Low - the lower boundary.');

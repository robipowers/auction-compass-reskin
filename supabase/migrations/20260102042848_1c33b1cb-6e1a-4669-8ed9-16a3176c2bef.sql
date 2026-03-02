-- Enable the pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table for storing AMT knowledge documents
CREATE TABLE public.amt_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'lesson',
  topic TEXT,
  difficulty TEXT DEFAULT 'beginner',
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table for search analytics
CREATE TABLE public.amt_search_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.amt_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amt_search_queries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for amt_documents
CREATE POLICY "Anyone can view AMT documents" ON public.amt_documents FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert documents" ON public.amt_documents FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for search queries
CREATE POLICY "Authenticated users can log queries" ON public.amt_search_queries FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view their own queries" ON public.amt_search_queries FOR SELECT USING (auth.uid() = user_id);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS amt_documents_embedding_idx ON public.amt_documents USING ivfflat (embedding vector_cosine_ops);

-- Updated at trigger
CREATE TRIGGER handle_amt_documents_updated_at
  BEFORE UPDATE ON public.amt_documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

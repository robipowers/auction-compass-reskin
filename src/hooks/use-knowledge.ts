import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface KnowledgeDocument {
  id: string;
  title: string;
  filename: string;
  total_chunks: number | null;
  status: string;
  created_at: string;
}

export interface KnowledgeSearchResult {
  chunk_id: string;
  document_id: string;
  document_title: string;
  content: string;
  similarity: number;
}

// Fetch all documents
export function useKnowledgeDocuments() {
  return useQuery({
    queryKey: ['knowledge-documents'],
    queryFn: async (): Promise<KnowledgeDocument[]> => {
      const { data, error } = await supabase
        .from('amt_documents')
        .select('id, title, filename, total_chunks, status, created_at')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    },
  });
}

// Search knowledge base
export function useKnowledgeSearch() {
  return useMutation({
    mutationFn: async ({
      query,
      matchCount = 5,
      matchThreshold = 0.7,
    }: {
      query: string;
      matchCount?: number;
      matchThreshold?: number;
    }): Promise<KnowledgeSearchResult[]> => {
      const { data, error } = await supabase.functions.invoke('amt-knowledge-search', {
        body: { query, matchCount, matchThreshold },
      });

      if (error) throw new Error(error.message);
      return data?.results || [];
    },
  });
}

// Delete document
export function useDeleteKnowledgeDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Delete related chunks first (RLS should handle this, but just in case)
      const { error: chunksError } = await supabase
        .from('amt_chunks')
        .delete()
        .eq('document_id', id);

      if (chunksError) throw new Error(chunksError.message);

      const { error } = await supabase
        .from('amt_documents')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-documents'] });
    },
  });
}

// Upload document (process and create chunks)
export function useUploadKnowledgeDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      const { data, error } = await supabase.functions.invoke('amt-document-process', {
        body: { title, content },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-documents'] });
    },
  });
}

// Get document stats
export function useKnowledgeStats() {
  return useQuery({
    queryKey: ['knowledge-stats'],
    queryFn: async () => {
      const [docsResult, chunksResult] = await Promise.all([
        supabase.from('amt_documents').select('id, status', { count: 'exact' }),
        supabase.from('amt_chunks').select('id', { count: 'exact' }),
      ]);

      const totalDocuments = docsResult.count ?? 0;
      const totalChunks = chunksResult.count ?? 0;
      const completedDocs = docsResult.data?.filter(d => d.status === 'completed').length ?? 0;

      return {
        totalDocuments,
        completedDocuments: completedDocs,
        processingDocuments: totalDocuments - completedDocs,
        totalChunks,
        isReady: completedDocs > 0,
      };
    },
    refetchInterval: 5000, // Poll every 5 seconds for processing updates
  });
}

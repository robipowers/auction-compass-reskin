import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, matchCount = 5, matchThreshold = 0.6 } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Searching AMT knowledge for:', query);

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Generate embedding for the query using OpenAI
    const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: query,
      }),
    });

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error('Embedding API error:', embeddingResponse.status, errorText);
      throw new Error(`Failed to generate embedding: ${embeddingResponse.status}`);
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data?.[0]?.embedding;

    if (!queryEmbedding) {
      throw new Error('No embedding returned from API');
    }

    console.log('Generated embedding with', queryEmbedding.length, 'dimensions');

    // Search for similar chunks using Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: chunks, error } = await supabase.rpc('search_amt_knowledge', {
      query_embedding: `[${queryEmbedding.join(',')}]`,
      match_threshold: matchThreshold,
      match_count: matchCount,
    });

    if (error) {
      console.error('Search error:', error);
      throw new Error(`Search failed: ${error.message}`);
    }

    console.log(`Found ${chunks?.length || 0} relevant chunks`);

    // Get document titles for context
    const documentIds = [...new Set(chunks?.map((c: any) => c.document_id) || [])];
    
    let documents: Record<string, string> = {};
    if (documentIds.length > 0) {
      const { data: docs } = await supabase
        .from('amt_documents')
        .select('id, title')
        .in('id', documentIds);
      
      documents = (docs || []).reduce((acc: Record<string, string>, doc: any) => {
        acc[doc.id] = doc.title;
        return acc;
      }, {});
    }

    // Format results with source attribution
    const results = (chunks || []).map((chunk: any) => ({
      content: chunk.content,
      source: documents[chunk.document_id] || 'Unknown',
      similarity: chunk.similarity,
      metadata: chunk.metadata,
    }));

    return new Response(
      JSON.stringify({ 
        results,
        query,
        totalResults: results.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AMT knowledge search error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

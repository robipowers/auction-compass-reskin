import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Text chunking configuration
const CHUNK_SIZE = 1500; // Characters per chunk
const CHUNK_OVERLAP = 200; // Overlap between chunks

function chunkText(text: string, chunkSize: number = CHUNK_SIZE, overlap: number = CHUNK_OVERLAP): string[] {
  const chunks: string[] = [];
  let start = 0;
  
  while (start < text.length) {
    let end = start + chunkSize;
    
    // Try to break at a paragraph or sentence boundary
    if (end < text.length) {
      const lastParagraph = text.lastIndexOf('\n\n', end);
      const lastSentence = text.lastIndexOf('. ', end);
      
      if (lastParagraph > start + chunkSize / 2) {
        end = lastParagraph + 2;
      } else if (lastSentence > start + chunkSize / 2) {
        end = lastSentence + 2;
      }
    }
    
    chunks.push(text.slice(start, end).trim());
    start = end - overlap;
  }
  
  return chunks.filter(chunk => chunk.length > 50); // Filter out very small chunks
}

async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.data?.[0]?.embedding;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, title } = await req.json();
    
    if (!content || !title) {
      return new Response(
        JSON.stringify({ error: 'title and content are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing document: ${title}`);
    console.log(`Content length: ${content.length} characters`);

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create document record using service role (bypasses RLS)
    const { data: docData, error: docError } = await supabase
      .from('amt_documents')
      .insert({
        title: title.trim(),
        filename: `${title.trim().toLowerCase().replace(/\s+/g, '-')}.txt`,
        file_path: 'manual-upload',
        status: 'processing',
      })
      .select()
      .single();

    if (docError) {
      throw new Error(`Failed to create document: ${docError.message}`);
    }

    const documentId = docData.id;

    // Chunk the content
    const chunks = chunkText(content);
    console.log(`Created ${chunks.length} chunks`);

    // Process chunks and generate embeddings
    let processedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      try {
        console.log(`Processing chunk ${i + 1}/${chunks.length}`);
        
        const embedding = await generateEmbedding(chunks[i], OPENAI_API_KEY);
        
        if (!embedding || embedding.length === 0) {
          throw new Error('Empty embedding returned');
        }

        // Store chunk with embedding
        const { error: insertError } = await supabase
          .from('amt_chunks')
          .insert({
            document_id: documentId,
            chunk_index: i,
            content: chunks[i],
            embedding: `[${embedding.join(',')}]`,
            metadata: {
              title: title,
              chunkIndex: i,
              totalChunks: chunks.length,
            },
          });

        if (insertError) {
          throw new Error(`Insert error: ${insertError.message}`);
        }

        processedCount++;

        // Rate limiting - wait between API calls
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (chunkError) {
        console.error(`Error processing chunk ${i}:`, chunkError);
        errors.push(`Chunk ${i}: ${chunkError instanceof Error ? chunkError.message : 'Unknown error'}`);
      }
    }

    // Update document status
    const finalStatus = errors.length === 0 ? 'completed' : (processedCount > 0 ? 'completed' : 'error');
    await supabase
      .from('amt_documents')
      .update({ 
        status: finalStatus,
        total_chunks: processedCount,
        error_message: errors.length > 0 ? errors.join('; ') : null,
      })
      .eq('id', documentId);

    console.log(`Document processing complete: ${processedCount}/${chunks.length} chunks processed`);

    return new Response(
      JSON.stringify({ 
        success: true,
        documentId,
        chunksProcessed: processedCount,
        totalChunks: chunks.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Document processing error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

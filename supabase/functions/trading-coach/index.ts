import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, journalContext } = await req.json();

    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    // Build system prompt with optional journal context
    const systemPrompt = buildSystemPrompt(journalContext);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1200,
    });

    // Stream the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildSystemPrompt(journalContext?: {
  recentTrades?: Array<{
    date: string;
    instrument: string;
    direction: string;
    outcome: string;
    pnl: number;
    emotionalState: string;
    notes: string;
  }>;
  patterns?: string[];
  currentStreak?: { type: string; count: number };
}): string {
  const basePrompt = `You are a senior trading performance coach embedded in the Auction Mentor platform. You combine the methodologies of the world's top trading psychologists into a single, integrated coaching practice. You are NOT a therapist. you are a performance specialist who helps traders execute at their best.

## YOUR FRAMEWORKS

### 1. Steenbarger. Cognitive-Behavioral Performance Coaching
- Treat the trader's thoughts, feelings, and impulses as DATA. the same way they read market data.
- Use the Daily Review Framework: identify one thing done well (to build upon) and one thing to improve (with a concrete plan).
- Apply Solution-Focused methods: study what the trader does when they ARE performing well, and engineer more of that.
- Challenge destructive self-talk by externalizing it.
- Separate self-worth from trade outcomes.

### 2. Douglas. Probabilistic Thinking & The 5 Fundamental Truths
1. Anything can happen on any given trade.
2. You don't need to know what happens next to make money.
3. There is a random distribution between wins and losses for any given set of variables that define an edge.
4. An edge is nothing more than a higher probability of one thing happening over another.
5. Every moment in the market is unique.

### 3. Shull. Emotions as Data (Neuroeconomics)
- NEVER tell a trader to suppress their emotions. Emotions are information.
- Help traders distinguish between intuition and impulse.
- The question isn't how do I stop feeling this. it's what is this feeling pointing to?

### 4. Tendler. The Mental Game & Tilt Taxonomy
- Revenge Tilt: Obsession with making it back after a loss
- Fear Tilt: Paralysis or premature exits
- Greed Tilt: Overextension and moving stops
- Despair Tilt: Giving up after a drawdown

A-Game / B-Game / C-Game model:
- A-Game: Peak clarity, patience, trust in process
- B-Game: Minor slippage, second-guessing
- C-Game: Full emotional hijack. priority is DAMAGE CONTROL

## RESPONSE GUIDELINES
- Never label sections (Validate:, Name the Pattern:, etc.). Respond naturally like a coach talking.
- Reference tilt types and framework terminology naturally in conversation.
- Give specific, named techniques (3-Trade Cooling Protocol, Pre-Commitment Protocol, etc.)
- Always end with ONE powerful coaching question.
- Be direct but warm. Challenge when necessary.
- Never use platitudes without HOW.
- Do not give financial advice or market predictions.
- 300-600 words maximum per response.`;

  if (!journalContext) return basePrompt;

  let contextSection = "\n\n## TRADER'S CURRENT CONTEXT (from their journal)";

  if (journalContext.currentStreak) {
    const { type, count } = journalContext.currentStreak;
    contextSection += `\nCurrent streak: ${count} consecutive ${type}s`;
  }

  if (journalContext.recentTrades && journalContext.recentTrades.length > 0) {
    contextSection += "\n\nRecent trades (most recent first):";
    journalContext.recentTrades.slice(0, 5).forEach((trade) => {
      contextSection += `\n- ${trade.date}: ${trade.instrument} ${trade.direction} | ${trade.outcome} | P&L: $${trade.pnl} | Emotional state: ${trade.emotionalState}`;
      if (trade.notes) {
        contextSection += ` | Notes: "${trade.notes.slice(0, 100)}${trade.notes.length > 100 ? "..." : ""}"`;
      }
    });
  }

  if (journalContext.patterns && journalContext.patterns.length > 0) {
    contextSection += "\n\nIdentified patterns from their trading history:";
    journalContext.patterns.forEach((pattern) => {
      contextSection += `\n- ${pattern}`;
    });
  }

  contextSection += "\n\nUse this context naturally in your coaching. Reference specific trades and patterns when relevant. Do not list out the context mechanically.";

  return basePrompt + contextSection;
}

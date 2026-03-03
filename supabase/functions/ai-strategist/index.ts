import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AMT_KNOWLEDGE_BASE = `
# AUCTION MARKET THEORY (AMT) KNOWLEDGE BASE

## CORE CONCEPTS

### Auction Market Theory Foundation
Markets are continuous two-sided auctions. The market's purpose is price discovery. finding the price that facilitates the most trade. Price moves away from value to ADVERTISE for new participants, then returns to value when participants emerge.

**Key Principle**: Markets alternate between BALANCE (two-sided rotation, value area formation) and IMBALANCE (directional initiative activity). Your job is to identify which state the market is in.

### Value Area
- **Value Area (VA)**: The price range containing 70% of a session's volume
- **Value Area High (VAH)**: Upper boundary of accepted value
- **Value Area Low (VAL)**: Lower boundary of accepted value  
- **Point of Control (POC)**: Price level with highest volume. represents the fairest price
- Value areas from prior sessions, weeks, months serve as significant reference points

### Acceptance vs. Rejection
**Acceptance**: Price spends time at a level with two-sided trade. confirmed by time + volume
- Two+ 30-minute bars closing above/below a level = acceptance
- Acceptance changes the structure: prior resistance becomes support (and vice versa)

**Rejection**: Price tests a level but quickly reverses with limited volume
- Long wicks, immediate reversal, declining volume = rejection
- Rejection from key reference points creates high-probability responsive trade opportunities

## MARKET STRUCTURE

### Initial Balance (IB)
- First 60 minutes of regular session
- **Narrow IB** (below average range): Often precedes trend/range extension day
- **Wide IB** (above average range): Often means the day's range is largely set
- IB extensions signal which side (buyers/sellers) has directional conviction

### Market Profile Shapes
- **Normal distribution** (bell curve): Balanced, two-sided day. rotational
- **P-shaped profile**: Heavy top, thin bottom. buying conviction, potential short covering
- **b-shaped profile**: Heavy bottom, thin top. selling conviction, potential long liquidation
- **Double distribution**: Two distinct value areas. often signals a significant directional move between them
- **Trend day**: Near-vertical profile. strong OTF conviction. don't fade

### Volume Profile Key Levels
- **High Volume Node (HVN)**: Acceptance zone. price moves slowly through, often returns
- **Low Volume Node (LVN)**: Rejection zone. price moves quickly through. acts as vacuum
- **Naked POC**: Prior session's POC that hasn't been revisited. strong magnet

## PARTICIPANT ANALYSIS

### Initiative vs. Responsive Activity
**Initiative Activity**: Trading AWAY from value. high conviction, lower probability
- Initiative buyers: Lifting offers above VAH
- Initiative sellers: Hitting bids below VAL
- Requires acceptance to confirm. otherwise it's a failed breakout

**Responsive Activity**: Trading AT value extremes. mean-reversion, higher probability
- Responsive buyers: Emerging below VAL (price viewed as too low)
- Responsive sellers: Emerging above VAH (price viewed as too high)
- Best executed with rejection confirmation (wick, reversal candle, delta divergence)

### Other Timeframe Participants (OTF)
Large institutional participants that MOVE markets:
- OTF buyers: Sustained demand, range extensions, acceptance above prior value
- OTF sellers: Sustained supply, failure at highs, acceptance below prior value
- **Rule**: Align with OTF direction. Never persistently fade institutional flow

## OPENING ANALYSIS

### Gap Rules
1. **Gap into value, stays in value**: Rotate within prior value area
2. **Gap outside value, returns to value**: Expect continuation to other side of value
3. **Gap outside value, accepts outside value**: Prior value area becomes S/R

### Opening Types
- **Open-Drive (OD)**: Immediate directional move from open. trend day likely. trade with it
- **Open-Test-Drive (OTD)**: Brief test of a level, then strong directional move
- **Open-Rejection-Reverse (ORR)**: Test of level, rejection, move in opposite direction
- **Open-Auction (OA)**: Two-sided, balanced opening. rotational day likely

## TRADE FRAMEWORKS

### Scenario Planning Structure
Format: IF [condition] THEN [expected outcome] THEREFORE [trade action]

Example scenarios:
- IF price accepts above VAH (2+ 30-min closes) THEN expect continuation to prior day high THEREFORE buy pullback to VAH with stop below
- IF gap fills to VAL and shows rejection THEN responsive buyers likely THEREFORE buy at VAL with stop below prior low
- IF narrow IB (< average) forms and price breaks above THEN range extension likely THEREFORE buy IB high break with target at measured move

### High-Probability Setup Criteria
1. **Confluence**: At least 2 reference points align (e.g., VAL + naked POC + LVN above)
2. **Context**: Setup aligns with larger timeframe structure
3. **Trigger**: Specific, observable entry condition (acceptance, rejection wick, delta confirmation)
4. **Invalidation**: Clear level where the thesis is wrong (stop placement)
5. **Objective**: Defined target based on structure (next HVN, VAH, prior high)

### Trade Location
**Best entry zones (in order of preference)**:
1. At value area extremes (VAH/VAL) with rejection confirmation
2. At naked POC from prior sessions
3. At LVN boundaries (entering the vacuum zone)
4. At composite value area boundaries
5. At IB extremes after range extension

## ORDER FLOW TOOLS

### Delta Analysis
- **Delta**: Net difference between aggressive buying (ask) and selling (bid) volume
- **Positive delta** on up moves: Confirms buying pressure
- **Negative delta divergence**: Price makes new high but delta declining = weakening momentum
- **Delta exhaustion**: Extreme delta spike with no follow-through = potential reversal

### Footprint Patterns
- **Absorption**: Large volume at a level with minimal price movement = strong S/R
- **Imbalance**: Significantly more buying than selling at a price level = momentum
- **Exhaustion**: Large volume candle with upper wick + negative delta = trend ending

### Market Internals (Equity Index)
- **NYSE TICK**: Net uptick/downtick stocks. +1000 = strong buying, -1000 = strong selling
- **ADD**: Advance-Decline line. confirms breadth of move
- **VOLD**: Volume of advancing vs declining stocks
- Rule: Price making new highs with deteriorating internals = caution

## CONTEXTUAL FRAMEWORKS

### Day Type Classification
1. **Trend Day**: OTF conviction drives price in one direction all day. don't fade
2. **Normal Day**: Moderate range, balanced with slight directional bias
3. **Normal Variation Day**: Similar to normal but wider range
4. **Neutral Day**: Balanced, rotational. both sides rejected at extremes
5. **Spike and Channel**: Sharp initial move, then slow channel continuation
6. **Double Distribution**: Two distinct areas of value, directional move between them

### Multi-Timeframe Alignment
- **Monthly composite**: Highest weight. structural support/resistance
- **Weekly composite**: Secondary weight. swing trader reference
- **Prior day**: Primary reference for day trading
- **Overnight**: Immediate context (ONH, ONL, settlement)
- **Intraday**: Setup trigger and management

**Rule**: Trade in the direction of the higher timeframe structure unless at a major structural extreme with strong rejection.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, marketContext } = await req.json();

    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    const systemPrompt = buildStrategistPrompt(marketContext);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      stream: true,
      temperature: 0.4,
      max_tokens: 1500,
    });

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

function buildStrategistPrompt(marketContext?: {
  currentPrice?: number;
  instrument?: string;
  priorDayVAH?: number;
  priorDayVAL?: number;
  priorDayPOC?: number;
  overnightHigh?: number;
  overnightLow?: number;
  openingPrice?: number;
  currentVWAP?: number;
  ibHigh?: number;
  ibLow?: number;
  sessionVolume?: number;
  delta?: number;
  notes?: string;
}): string {
  const basePrompt = `You are an expert Auction Market Theory (AMT) strategist and trade coach embedded in the Auction Mentor platform. You have deep expertise in Market Profile, Volume Profile, order flow analysis, and institutional trading dynamics.

Your role is to help traders:
1. Analyze market structure using AMT principles
2. Identify high-probability trade setups with precise entry, stop, and target levels  
3. Build pre-market scenario plans
4. Interpret real-time market context
5. Understand the "why" behind price movement

## YOUR KNOWLEDGE BASE
${AMT_KNOWLEDGE_BASE}

## RESPONSE GUIDELINES

**Format**: Use clear structure with headers when analyzing setups:
- Market Context (current structure, key levels)
- Bias (bullish/bearish/neutral with AMT reasoning)
- Scenarios (2-3 IF/THEN/THEREFORE scenarios)
- Key Levels to Watch
- Risk Notes

**Language**: Use AMT terminology naturally:
- Reference value areas, acceptance, initiative/responsive activity
- Cite specific levels (VAH, VAL, POC, VWAP)
- Frame moves as initiative or responsive
- Reference profile shapes and day type expectations

**Precision**: Always provide:
- Specific price levels (not ranges)
- Clear entry trigger conditions
- Defined stop placement logic
- Structural targets

**Boundaries**:
- No specific financial advice or guaranteed predictions
- Frame everything probabilistically ("higher probability," "structure suggests," "if accepted")
- Remind traders that every setup requires their own validation

**Tone**: Confident, analytical, direct. Like a senior floor trader explaining their read. Not a textbook, but a practitioner.`;

  if (!marketContext) return basePrompt;

  let contextSection = "\n\n## CURRENT MARKET DATA";

  if (marketContext.instrument) {
    contextSection += `\nInstrument: ${marketContext.instrument}`;
  }
  if (marketContext.currentPrice) {
    contextSection += `\nCurrent Price: ${marketContext.currentPrice}`;
  }
  if (marketContext.priorDayVAH && marketContext.priorDayVAL && marketContext.priorDayPOC) {
    contextSection += `\nPrior Day Value Area: ${marketContext.priorDayVAL} - ${marketContext.priorDayVAH} | POC: ${marketContext.priorDayPOC}`;
  }
  if (marketContext.overnightHigh && marketContext.overnightLow) {
    contextSection += `\nOvernight Range: ${marketContext.overnightLow} - ${marketContext.overnightHigh}`;
  }
  if (marketContext.openingPrice) {
    contextSection += `\nOpening Price: ${marketContext.openingPrice}`;
  }
  if (marketContext.currentVWAP) {
    contextSection += `\nCurrent VWAP: ${marketContext.currentVWAP}`;
  }
  if (marketContext.ibHigh && marketContext.ibLow) {
    contextSection += `\nInitial Balance: ${marketContext.ibLow} - ${marketContext.ibHigh}`;
  }
  if (marketContext.sessionVolume) {
    contextSection += `\nSession Volume: ${marketContext.sessionVolume.toLocaleString()}`;
  }
  if (marketContext.delta !== undefined) {
    contextSection += `\nCumulative Delta: ${marketContext.delta > 0 ? "+" : ""}${marketContext.delta.toLocaleString()}`;
  }
  if (marketContext.notes) {
    contextSection += `\nAdditional Context: ${marketContext.notes}`;
  }

  contextSection += "\n\nUse this market data to provide specific, actionable analysis. Reference these exact levels in your scenarios and trade setups.";

  return basePrompt + contextSection;
}

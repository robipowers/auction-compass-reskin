export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  readTime: number; // minutes
  summary: string;
  content: string;
  keyPoints: string[];
  relatedArticles?: string[];
  tags: string[];
}

export const AMT_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  // ============================================================
  // FOUNDATIONS
  // ============================================================
  {
    id: "amt-foundation-auction-process",
    title: "The Auction Process: How Markets Really Work",
    category: "Foundations",
    difficulty: "beginner",
    readTime: 8,
    summary: "Understand the fundamental mechanics of how markets function as continuous two-sided auctions, and why this knowledge changes everything about how you read price action.",
    content: `## The Core Insight Most Traders Miss

Most traders learn to read charts as a series of patterns: head and shoulders, double tops, flag formations. They memorize candlestick names and indicator crossovers. But this approach misses the underlying *why* behind price movement.

Auction Market Theory starts with a simple premise: **a market is nothing more than a mechanism for connecting buyers and sellers.**

Every tick of price is the result of a negotiation. At any given moment, the market is doing one of two things:

1. **Facilitating trade**: Both buyers and sellers are willing to transact at the current price. The market is in balance.
2. **Advertising for trade**: Current prices aren't attracting enough participation on one side. The market must move to find willing participants.

This is the auction process in its simplest form.

## The Two-Sided Auction

Imagine a traditional auction house. The auctioneer calls out a price. If buyers are interested, they bid. The auctioneer raises the price until only one buyer remains. If no one bids, the price drops.

Financial markets work the same way, but simultaneously in both directions. The market is continuously testing higher prices (looking for sellers) and lower prices (looking for buyers).

When price moves UP, it's asking: *"Are there buyers willing to pay this price?"*  
When price moves DOWN, it's asking: *"Are there sellers willing to sell at this price?"*

The market STOPS moving in a direction when it finds sufficient participation on both sides. This is what creates areas of price **acceptance**.

## Value and the Value Area

Over time, the market develops a sense of "fair value". the price range where the most business is done. This is the **Value Area**.

The Value Area is not arbitrary. It's determined by the actual behavior of market participants. When price is in the value area, both buyers and sellers are comfortable transacting. Volume is high. Trade is facilitated.

When price moves OUTSIDE the value area, it's advertising. It's testing whether participants will follow price to new levels. If they do, a new value area forms. If they don't, price returns to the prior value area.

This simple concept. value area, acceptance, advertisement. is the foundation of every AMT-based trade.

## Why Price Moves

Price doesn't move randomly (despite what efficient market hypothesis suggests). It moves for structural reasons:

**Price moves away from value because**:
- One side (buyers or sellers) has stronger conviction than the other
- There's an imbalance between supply and demand at current prices
- The market needs to find new participants at different price levels

**Price returns to value because**:
- Participants at extreme prices view them as unfair
- Responsive participants emerge to take the other side
- The auction is self-correcting toward the area of most business

Understanding this rhythm. away from value, then back to value. is the foundation of both trend-following and mean-reversion strategies.

## The Practical Application

Once you understand markets as auctions, you start asking different questions:

**Instead of**: "Is this a bull flag or a bear flag?"
**You ask**: "Is price accepting at this level, or advertising away from it?"

**Instead of**: "Did the RSI confirm the breakout?"
**You ask**: "Did price spend time at the new level? Did volume confirm acceptance?"

**Instead of**: "Is this pattern bullish or bearish?"
**You ask**: "Where is current price relative to established value? What's the context?"

These aren't just semantic differences. They represent a fundamentally different way of reading the market. One that aligns with how the market actually works.`,
    keyPoints: [
      "Markets exist to connect buyers and sellers, not to provide trading opportunities",
      "Price moves away from value to advertise for new participants",
      "The Value Area represents where the most business was done. it IS current consensus fair value",
      "Acceptance (time + volume at a price) is what creates meaningful support and resistance",
      "Every price move is either advertising (testing for participants) or facilitating (transacting between willing participants)",
    ],
    relatedArticles: ["amt-value-area-deep-dive", "amt-acceptance-rejection"],
    tags: ["foundations", "auction theory", "value area", "price discovery"],
  },
  {
    id: "amt-value-area-deep-dive",
    title: "Value Area Deep Dive: VAH, VAL, and POC",
    category: "Foundations",
    difficulty: "beginner",
    readTime: 10,
    summary: "Master the three most important reference points in Auction Market Theory and learn how to use them as the foundation of every trade decision.",
    content: `## The Three Numbers That Define Market Structure

If you could only use three numbers to make trading decisions, the Value Area High (VAH), Value Area Low (VAL), and Point of Control (POC) would be those three numbers.

These aren't just technical indicators. They're empirical measurements of where actual business was conducted in the market. They represent the market's verdict on fair value.

## Value Area High (VAH)

The VAH is the upper boundary of the value area. the highest price still considered "fair" by the market's participants.

**What it means**: The market transacted business up to this level, but not significantly above it. Above the VAH, either sellers emerged strongly (creating resistance) or buyers were unwilling to pay higher prices.

**How price typically behaves at VAH**:
- **First test**: Often sees a pause or minor pullback. the market is "checking" whether the level is still valid
- **Rejection from VAH**: Price touches VAH, sellers emerge, price returns to value. This is classic **responsive selling**.
- **Acceptance above VAH**: Price moves above VAH and HOLDS. Two or more 30-minute bars close above VAH. This signals **initiative buying**. the market is establishing new, higher value.

**Practical rule**: The VAH is only broken (not just touched) when price accepts above it with time and volume. A quick spike above followed by a close back inside is a rejection, not a breakout.

## Value Area Low (VAL)

The mirror image of the VAH. The VAL is the lower boundary of the value area.

**What it means**: The market transacted business down to this level, but not significantly below it. Below the VAL, either buyers emerged (support) or sellers were unwilling to offer at lower prices.

**How price typically behaves at VAL**:
- **Responsive buying at VAL**: Price drops to VAL, buyers who view current prices as "too cheap" emerge. Price bounces back into value. High-probability setup.
- **Acceptance below VAL**: Price accepts below VAL, prior support becomes resistance. The market has revised its assessment of fair value lower.

**The VAL rule**: When price opens above VAL and pulls back to VAL, the probability of a bounce is statistically high. This is one of the most reliable setups in AMT-based trading.

## Point of Control (POC)

The POC is the single price level where the most volume traded during a session. It's the mathematical "center of gravity" of the session's activity.

**Why it matters**:
- The POC represents the truest expression of fair value for the session
- It acts as a magnet. price tends to gravitate toward the POC before making sustained moves
- **Naked POCs** (prior session POCs that haven't been revisited) are among the highest-probability reference points in the entire market

**POC as a trade location**: When price is above the POC, the POC acts as potential support. Below the POC, it acts as potential resistance. Price frequently revisits the POC before continuing in its directional move.

## Using These Levels Together

The real power comes from using VAH, VAL, and POC as a system:

**Scenario 1: Price opens inside value**
- If price opens between VAL and VAH, the default expectation is rotation between these levels
- Look for responsive trades at VAH (short) and VAL (long)
- Wait for acceptance outside the value area before taking initiative trades

**Scenario 2: Price opens above the value area**
- If price opens above VAH, watch whether it accepts above VAH or returns inside value
- Return inside value after an above-value open (Gap Rule 2) often leads to rotation toward VAL

**Scenario 3: Price opens below the value area**
- If price opens below VAL, watch whether it accepts below VAL or returns inside value
- Return inside value after a below-value open often leads to rotation toward VAH

## The Layered Reference Framework

Professional AMT traders don't just use prior day levels. They build a layered framework:

1. **Prior day** VAH/VAL/POC: Primary reference for day traders
2. **Prior week** composite VA: Secondary reference (swing structure)
3. **Prior month** composite VA: Structural S/R for longer timeframes
4. **Overnight** high/low: Immediate context
5. **VWAP**: Real-time "fair value" for the current session

When multiple timeframe value areas align at the same price level, the significance increases dramatically. A prior day VAH that also aligns with a weekly composite VAL and a naked weekly POC is not just a reference point. it's a major structural level.`,
    keyPoints: [
      "VAH and VAL are the market's self-determined boundaries of fair value. not arbitrary technical levels",
      "First test of VAH/VAL often produces a pause; second test with acceptance signals structural change",
      "The POC is the mathematical center of gravity. price gravitates toward it before making sustained moves",
      "Naked POCs (unvisited prior POCs) are among the highest-probability reference points in the market",
      "The real power comes from layering multiple timeframe value areas to find high-confluence zones",
    ],
    relatedArticles: ["amt-foundation-auction-process", "amt-acceptance-rejection", "amt-gap-rules"],
    tags: ["value area", "VAH", "VAL", "POC", "reference levels"],
  },
  {
    id: "amt-acceptance-rejection",
    title: "Acceptance and Rejection: The Market's Verdict",
    category: "Foundations",
    difficulty: "beginner",
    readTime: 9,
    summary: "Learn to distinguish between genuine breakouts (acceptance) and false moves (rejection), and why this distinction is the most important skill in AMT-based trading.",
    content: `## The Most Misunderstood Concept in Trading

Thousands of traders lose money every day by confusing price movement with price acceptance. They see price break above a key level and immediately enter long. Then they watch in frustration as price reverses and takes out their stop.

The problem isn't the setup. it's the failure to distinguish between **price visiting a level** and **price accepting a level**.

This distinction. acceptance vs. rejection. is arguably the most important concept in Auction Market Theory.

## What Acceptance Means

Acceptance is not about price breaking a level. It's about the market AGREEING that the new level represents fair value.

Acceptance requires evidence of **two-sided trade**:
- Buyers AND sellers are willing to transact at the new price
- Volume at the level confirms genuine business is being done
- Time at the level (multiple bar closes) shows the market isn't immediately rejecting the price

**The standard acceptance confirmation**: Two or more consecutive 30-minute bars closing above (for bullish acceptance) or below (for bearish acceptance) a key reference level.

This isn't a rigid rule. it's a framework. The key question is: *Is the market doing business here, or just visiting?*

## What Rejection Means

Rejection is the market's verdict that a price is unfair. When price moves to a level but fails to find willing participants on both sides, it rejects the price and returns to the area where business was being done.

**Signs of rejection**:
- Quick reversal from a level (minimal time spent)
- Long wicks on candles touching the level
- Low volume at the tested level
- Delta divergence (buying pressure on the way up, but delta turns negative at the high)
- Return to prior value area quickly after the test

**Strong vs. weak rejection**:
- **Strong rejection**: Large volume surge at the level, immediate reversal, closes far from the level
- **Weak rejection**: Slow drift back from level, minimal volume, may test again

Strong rejection from key reference points creates some of the highest-probability trade opportunities in the market.

## The Business Test

Here's a simple mental model: **imagine you own a store.**

If customers are willing to pay $100 for your product and you raise the price to $110, what happens? If customers keep buying at $110, you've found acceptance at a higher price. Your new fair price is $110.

But if customers stop buying when you raise to $110, you've found rejection. Price needs to come back to where business was being done ($100) or even lower to find new customers.

Markets work exactly the same way. When price moves to a new level, the question is always: **are participants willing to do business here?**

## Why This Matters for Entries

Most traders enter breakouts when price TOUCHES a level. AMT-based traders wait for ACCEPTANCE.

**The cost of waiting for acceptance**:
- You miss the initial move out of the level
- Your entry is worse (higher for longs, lower for shorts)

**The benefit of waiting for acceptance**:
- Higher probability that the breakout is genuine
- Clearer stop placement (below the acceptance zone)
- You avoid the false breakout that destroys most breakout traders

Over time, the improved win rate from waiting for acceptance far outweighs the slightly worse entry price.

## Practical Examples

**Example 1: Bullish acceptance**
Price is below the prior day's VAH (4520). Price rallies to 4520 and closes above it on the 30-minute chart. A second 30-minute bar then closes above 4520. This is acceptance. The probability of continuation higher has increased significantly. Look for long entries on pullbacks to 4520 (now support).

**Example 2: Rejection**
Price rallies to the prior day's VAH (4520). The 30-minute bar touches 4520 but closes at 4515 with a wick above. The next bar immediately drops to 4510. This is rejection. The probability of a return to lower value (VAL) has increased. Look for short entries on rallies back toward 4520.

**Example 3: The gray zone**
Price closes one bar above 4520 but immediately comes back below on the next bar. Is this acceptance or rejection? This is context-dependent. If it was the first time price touched this level after a strong rally, treat it as potential acceptance that needs one more bar to confirm. If price has been failing at 4520 repeatedly, treat it as rejection until proven otherwise.

## The Time Component

Time spent at a price level is information. The more time spent, the more two-sided trade is occurring, the stronger the acceptance signal.

A quick spike above a level is advertising. the market is testing whether participants will follow at higher prices. If they don't (quick reversal), that's rejection. If they do (sustained trade above), that's acceptance.

This is why day traders watch the developing market profile. A profile that's building above a key level, with multiple TPOs printing above, is building acceptance in real time.`,
    keyPoints: [
      "Acceptance requires two-sided trade at a level. not just a price visit",
      "The standard confirmation is two+ consecutive 30-min bars closing on the correct side of the level",
      "Strong rejection from key reference points creates high-probability responsive trade opportunities",
      "Waiting for acceptance before entry costs you entry price but dramatically improves win rate",
      "Time spent at a price level is proportional to the strength of acceptance. quick visits are rejection tests",
    ],
    relatedArticles: ["amt-value-area-deep-dive", "amt-initiative-responsive", "amt-gap-rules"],
    tags: ["acceptance", "rejection", "breakout", "confirmation", "trade entry"],
  },
  // ============================================================
  // MARKET STRUCTURE
  // ============================================================
  {
    id: "amt-initial-balance",
    title: "The Initial Balance: Your Daily Trading Framework",
    category: "Market Structure",
    difficulty: "intermediate",
    readTime: 11,
    summary: "Learn why the first hour of trading is the most information-dense period of the day and how to use Initial Balance analysis to frame every trading decision.",
    content: `## Why the First Hour Is Different

The opening of the regular trading session is unlike any other time of day. The confluence of overnight participants, pre-market news reactions, and institutional order flow creates a period of intense price discovery.

J. Peter Steidlmayer, who developed Market Profile, identified the first 60 minutes of the regular session as the **Initial Balance**. This period sets the framework for the entire trading day.

## What the Initial Balance Tells You

The IB range (the distance between the IB high and IB low) contains critical information:

**Narrow Initial Balance** (below average range for the instrument):
- The market hasn't found direction yet
- Both buyers and sellers are active but neither dominates
- Potential for a **range extension day** (price breaks significantly above or below the IB)
- Often precedes trend days
- Trading strategy: Wait for IB breakout with acceptance before committing to direction

**Wide Initial Balance** (above average range):
- Strong directional conviction was present at the open
- The day's range may largely be set
- Lower probability of significant extension beyond the IB
- Trading strategy: Look for responsive trades at IB extremes; fade extensions if unsupported by volume

**Average Initial Balance**:
- Most common type
- Moderate range extension expected on one side
- Wait for the opening type to clarify direction

## Range Extensions: Following the Initiative Players

Once the IB is established, the most important question becomes: **will price extend beyond the IB, and in which direction?**

A **range extension** occurs when price breaks above the IB high or below the IB low during the session. This signals that **Other Timeframe Participants (OTF)** are pushing price in a directional move.

**Bullish range extension**: Price breaks above the IB high. OTF buyers are present. Look for long opportunities on pullbacks to the IB high (now support) with confirmation.

**Bearish range extension**: Price breaks below the IB low. OTF sellers are present. Look for short opportunities on rallies back to the IB low (now resistance) with confirmation.

**Double extension**: Price extends both above AND below the IB. This signals a volatile, two-sided day. Often resolves in the direction of the second extension.

## IB Size and Day Type Prediction

Experienced AMT traders calculate the average IB range for their instrument over the prior 20 sessions. This gives them context for each day's IB:

- **IB < 75% of average**: Likely range day. potential for large extension
- **IB 75-125% of average**: Normal day expected
- **IB > 125% of average**: Wide day. potential for rotation within IB

This isn't predictive in the traditional sense. It's probabilistic. A narrow IB doesn't GUARANTEE a trend day. it raises the probability.

## Practical IB Trading Framework

**Pre-market preparation**:
1. Calculate prior day's IB range
2. Note average IB for the instrument
3. After first 60 minutes, assess current IB relative to average
4. Formulate IB scenarios before price moves

**IB Scenario Template**:
- IF IB is narrow AND price breaks above IB high with volume THEN range extension likely THEREFORE buy the break with stop below IB high
- IF IB is wide AND price tests IB high THEN responsive sellers likely THEREFORE look for short at IB high with stop above
- IF price breaks IB high then returns inside IB THEN failed breakout THEREFORE consider short toward IB low or POC

## The IB and Opening Types Integration

The IB works in conjunction with opening type analysis:

- **Open-Drive + Narrow IB**: Highest probability trend day
- **Open-Auction + Wide IB**: Classic rotation day. fade the extremes
- **Open-Rejection-Reverse**: Watch whether rejection takes price outside IB on the reverse side`,
    keyPoints: [
      "The Initial Balance (first 60 minutes) sets the framework for the entire trading day",
      "Narrow IB = potential trend day; wide IB = range day where most of the range is already set",
      "Range extensions (breaks beyond IB high/low) signal OTF participant involvement",
      "Calculate your instrument's average IB range to contextualize each day's IB",
      "IB high and low become significant support/resistance after being established",
    ],
    relatedArticles: ["amt-opening-types", "amt-day-types", "amt-initiative-responsive"],
    tags: ["initial balance", "range extension", "day types", "market structure", "IB"],
  },
  {
    id: "amt-opening-types",
    title: "Opening Types: Reading the Market's First Move",
    category: "Market Structure",
    difficulty: "intermediate",
    readTime: 10,
    summary: "Master the four opening types that signal what kind of trading day to expect, and learn how identifying the open within the first 30 minutes can frame your entire session.",
    content: `## The Open Is the Most Information-Dense Moment of the Day

Most traders waste the open. They're still setting up charts, reading news, or waiting for the "dust to settle." This is a mistake.

The market's first moves are its most revealing. The interaction between overnight positions, institutional order flow, and responsive participants creates a specific opening pattern. Learning to identify this pattern early frames your entire day.

## The Four Opening Types

### Open-Drive (OD)
**What it looks like**: Price opens and immediately moves in one direction with minimal pullback. The first 5-15 minutes establish a clear directional commitment.

**What it means**: OTF participants (institutions, large funds) have strong conviction and are committing to directional activity from the open. This is the footprint of an informed participant who NEEDS to get a position on.

**How to trade it**: 
- Do NOT fade an Open-Drive
- Look for brief pullbacks to initiate or add to positions IN THE DIRECTION of the drive
- The first pullback after an OD is often a high-probability entry
- Expect a range extension (trend day) to develop

**Classic mistake**: Selling into an Open-Drive up because it "looks extended." Open-Drives have momentum that most traders underestimate.

### Open-Test-Drive (OTD)
**What it looks like**: Price opens and makes a brief test of a prior reference level (overnight high, prior day VAH/VAL, etc.) then drives in the opposite direction.

**What it means**: The market is testing whether prior participants (from overnight or prior session) are still present. When it fails to find follow-through at the test level, the opposite side takes control.

**How to trade it**:
- The initial test is often a false move designed to trigger stops and find liquidity
- Wait for the test to complete and the drive to begin
- The drive after the test often becomes the day's directional move
- Entry: pullback to the start of the drive

**Example**: Market opens below overnight low (OTD lower), immediately recovers and drives higher. The break of overnight low was a liquidity grab; the drive higher is the real move.

### Open-Rejection-Reverse (ORR)
**What it looks like**: Price opens, tests a level (often an extreme: prior day high, overnight high, key resistance), shows clear rejection at that level, then reverses and moves in the opposite direction.

**What it means**: The tested level held. Participants at that extreme found the price unfair and responded. The rejection creates a reference point for the day.

**How to trade it**:
- The rejection point becomes the day's key reference (resistance for ORR from above, support for ORR from below)
- Trade in the direction of the reversal
- The reversal often carries significant momentum as stops from the initial move get triggered
- Target: prior value area boundaries, POC

**Key signal**: High volume at the rejection point with immediate reversal = strong ORR. Low volume, slow drift back = weak ORR, potentially just a pause before continuation.

### Open-Auction (OA)
**What it looks like**: Price opens and trades in both directions without clear commitment. Multiple tests of both sides, no clear direction established.

**What it means**: The market is balanced. Neither OTF buyers nor sellers have clear conviction. The day's direction will emerge from the developing structure.

**How to trade it**:
- Don't force directional trades early
- Wait for the initial balance to establish, then watch for extension or continuation of rotation
- Responsive trades at IB extremes are higher probability
- When direction does emerge (IB extension), it often has more momentum because it took longer to develop

**Classic pattern**: Open-Auction in the morning, then strong directional move in the afternoon when one side finally wins the balance.

## Identifying Opening Type Quickly

You have roughly 30 minutes to identify the opening type before much of the information value is lost.

Key questions to ask in the first 15-30 minutes:
1. Is price moving in one direction persistently? (OD)
2. Did price make a quick test of a prior level then reverse? (OTD or ORR)
3. Is price rotating in both directions with no commitment? (OA)

Note the opening type in your journal every day. After 20-30 sessions, you'll develop an intuition for identifying them earlier and more accurately.`,
    keyPoints: [
      "The opening type, identified within 30 minutes, frames the entire trading day",
      "Open-Drive = trend day likely. trade with it, never fade it",
      "Open-Test-Drive = initial move is a test/liquidity grab; the drive after is the real move",
      "Open-Rejection-Reverse = tested level held; trade in direction of the reversal",
      "Open-Auction = balanced day; wait for IB to complete and extension to signal direction",
    ],
    relatedArticles: ["amt-initial-balance", "amt-day-types", "amt-initiative-responsive"],
    tags: ["opening types", "open drive", "open rejection reverse", "open auction", "day trading"],
  },
  // ============================================================
  // TRADE EXECUTION
  // ============================================================
  {
    id: "amt-initiative-responsive",
    title: "Initiative vs. Responsive Trading: The Two Core Trade Types",
    category: "Trade Execution",
    difficulty: "intermediate",
    readTime: 12,
    summary: "Master the fundamental distinction between initiative and responsive trading, understand when to use each approach, and learn why most retail traders consistently choose the wrong type.",
    content: `## The Only Two Trades That Exist

In Auction Market Theory, there are ultimately only two types of trades:

1. **Responsive trades**: You're trading BACK TOWARD value. Mean reversion.
2. **Initiative trades**: You're trading AWAY FROM value. Breakout/trend following.

Every trade you make is one of these two types, whether you know it or not. The problem is that most traders take initiative trades while thinking they're taking responsive trades. and vice versa.

Understanding which type you're executing. and choosing the right type for the context. is one of the highest-leverage improvements any trader can make.

## Responsive Trading: Trading with the House

Responsive trading is based on a simple premise: **when price moves to an extreme, the probability of mean reversion is higher than the probability of continuation.**

Why? Because at value extremes:
- Buyers who view prices as "too cheap" emerge (at VAL)
- Sellers who view prices as "too expensive" emerge (at VAH)
- These responsive participants provide the fuel for the reversal

**Responsive trade characteristics**:
- **Entry**: At or near an established value area boundary (VAH, VAL, prior POC, composite level)
- **Direction**: Against the recent momentum, toward value
- **Risk**: Well-defined (stop outside the reference level)
- **Reward**: Limited to the distance to the opposite value area boundary or POC
- **Win rate**: Higher (you're fading extreme prices back to center of value)
- **Reward/risk**: Lower (you're often targeting the POC from the VAL, a defined range)

**When responsive trades have the highest probability**:
1. Price is at an established, well-tested value area boundary
2. There's a clear rejection signal at the level (wick, reversal candle, delta divergence)
3. The broader context (daily/weekly structure) supports the level holding
4. Volume confirms the responsive activity (surge in volume at the level)

**Common responsive trade mistakes**:
- Entering before confirmation (the level might extend further)
- Targeting too large a profit (responsive trades work back to value, not through it)
- Ignoring context (responsive trades fail when OTF players are initiative in the opposite direction)

## Initiative Trading: Trading with Conviction

Initiative trading is the opposite: you're following strong conviction AWAY from established value into new territory.

**Initiative trade characteristics**:
- **Entry**: Above established value area (initiative long) or below (initiative short)
- **Direction**: With the momentum, away from prior value
- **Risk**: Less well-defined (you're in new price territory)
- **Reward**: Larger (if accepted, you're establishing a new value area)
- **Win rate**: Lower (many breakouts fail)
- **Reward/risk**: Higher (when they work, they work big)

**When initiative trades have the highest probability**:
1. Clear acceptance above/below the value area (two+ bars closing outside)
2. Strong volume confirming the breakout
3. OTF participants identifiable in the order flow (delta, internals)
4. Opening type supports directional conviction (Open-Drive, Open-Test-Drive)
5. Higher timeframe structure aligns with the breakout direction

**Common initiative trade mistakes**:
- Entering on a touch of the level rather than acceptance above it
- Entering too late (after the acceptance is well-established)
- Ignoring failed breakout signals (returning inside value after the breakout is a major warning)

## The Most Important Question Before Every Trade

Before entering any trade, ask yourself:

**"Am I trying to trade back toward value (responsive), or away from value (initiative)?"**

Then ask: **"Does the current market context support that type of trade?"**

- Rotational market, price at VAH? Responsive short. High probability.
- Strong initiative activity with acceptance above VAH? Responsive short. Wrong trade.
- Clear acceptance above VAH with OTF buying? Initiative long. High probability.
- Price touching VAH with no acceptance? Initiative long. Wrong trade.

The context determines which trade type is appropriate. Getting this right is more important than any entry pattern or indicator signal.

## A Framework for Choosing

Use this decision tree before every trade:

1. **Where is current price relative to value?**
   - At a value area boundary → Responsive trade consideration
   - Outside value area (accepted) → Initiative trade consideration
   - Inside value area → Responsive trade consideration (rotate)

2. **What does the opening type suggest?**
   - Open-Drive → Initiative trades preferred
   - Open-Auction → Responsive trades preferred
   - Open-Rejection-Reverse → Responsive in direction of the reversal

3. **What does higher timeframe structure say?**
   - Price at major weekly/monthly resistance → Responsive short, not initiative long
   - Price breaking above major structure with acceptance → Initiative long, not responsive short

4. **What is OTF doing?**
   - Clear OTF buying (delta, range extensions, acceptance higher) → Take initiative longs, avoid responsive shorts
   - Clear OTF selling → Take initiative shorts, avoid responsive longs`,
    keyPoints: [
      "Every trade is either responsive (back toward value) or initiative (away from value)",
      "Responsive trades have higher win rates but smaller reward/risk ratios",
      "Initiative trades have lower win rates but larger reward/risk ratios when they work",
      "The market context (rotational vs. trending, opening type, OTF presence) determines which trade type is appropriate",
      "The most common mistake is taking initiative trades in a responsive context, and vice versa",
    ],
    relatedArticles: ["amt-acceptance-rejection", "amt-opening-types", "amt-scenario-planning"],
    tags: ["initiative", "responsive", "trade type", "mean reversion", "breakout", "execution"],
  },
  {
    id: "amt-scenario-planning",
    title: "Scenario Planning: How Professionals Prepare for the Trading Day",
    category: "Trade Execution",
    difficulty: "intermediate",
    readTime: 13,
    summary: "Build a pre-market routine that eliminates reactive decision-making and replaces it with structured, pre-planned scenarios. This is how professional traders remove emotion from execution.",
    content: `## The Problem with Reactive Trading

Here's what happens to most traders during the trading day:

Price starts moving. They react. They make a decision under time pressure, with incomplete information, and with their emotional state fully activated by the movement they're watching.

This is the worst possible environment for making high-quality decisions.

Scenario planning is the solution. Instead of reacting to what the market does, you decide IN ADVANCE what you will do under specific conditions. When the market meets your conditions, you execute. When it doesn't, you wait.

## The IF/THEN/THEREFORE Structure

Every scenario follows a three-part structure:

**IF** [specific, observable market condition]
**THEN** [expected structural outcome based on AMT principles]
**THEREFORE** [your specific trade action]

The "IF" must be observable and objective. Not "if the market looks strong" but "if price accepts above the prior day VAH with two 30-minute closes."

The "THEN" must be based on AMT logic. Not "then it will go up" but "then new higher value is being established and responsive buyers are likely to emerge at VAH."

The "THEREFORE" must be specific. Not "then I'll look for longs" but "then I'll buy a pullback to the prior day VAH with a stop 2 points below and a first target at the overnight high."

## Building Your Pre-Market Scenarios

**Step 1: Identify key reference levels**
- Prior day VAH, VAL, POC
- Overnight high and low
- Settlement price
- Weekly/monthly composite VA boundaries if relevant
- Naked POCs from prior sessions

**Step 2: Identify where price is opening relative to these levels**
- Opening inside value? Outside value? Above/below overnight range?
- Apply Gap Rules to determine the baseline expectation

**Step 3: Build 2-3 scenarios**
- **Scenario A** (primary): Based on the highest-probability outcome given current structure
- **Scenario B** (secondary): If Scenario A fails, what's next?
- **Scenario C** (alternative): The "what if" scenario for a major structural change

**Step 4: Define triggers, entries, stops, targets for each**
- Each scenario needs specific, non-negotiable parameters
- These are written before the market opens when you're calm and analytical

## Example Pre-Market Scenario Plan

**Market context**: ES opening 5 points above prior day VAH (4520). Prior day POC at 4510. ONH at 4528, ONL at 4512.

**Scenario A (Bullish acceptance)**:
- IF price accepts above prior day VAH 4520 (two 30-min closes above)
- THEN new higher value is establishing; 4520 becomes support
- THEREFORE buy pullback to 4520 with stop at 4516, target prior day high at 4535

**Scenario B (Gap fill)**:
- IF price fails to hold above 4520 and returns inside prior value area
- THEN Gap Rule 2 applies; expect rotation toward VAL
- THEREFORE short below 4518 with stop at 4523, target prior day POC at 4510, then VAL at 4498

**Scenario C (Ranging)**:
- IF price rotates between 4520 and 4510 without clear directional acceptance
- THEN market is in balance/auction mode
- THEREFORE responsive longs at 4510-4512, responsive shorts at 4520-4522, no initiative trades

## The Psychology of Scenario Planning

Scenario planning doesn't just improve your trading mechanics. it transforms your emotional experience of trading.

**Without scenarios**: Every price movement is a stimulus requiring an immediate response. Your emotional state determines your decisions. You're reactive.

**With scenarios**: You have a framework. When price does X, you do Y. You've already made the decision. Your only job now is execution and patience. You're proactive.

This is why professional traders can sit still during periods of uncertainty. They're not paralyzed. They're waiting for THEIR scenario to trigger. A setup that doesn't trigger is not a missed opportunity. it's the discipline to not force trades.

## Reviewing Your Scenarios

After the close, your scenario review is one of the most valuable learning exercises available:

1. Which scenario played out?
2. Did you execute according to the plan, or did you deviate?
3. If you deviated, why? What was the emotional or reasoning trigger?
4. How often does each scenario type appear? (Build your pattern library)
5. What context clues could have given you higher confidence in the correct scenario earlier?

After 20-30 days of scenario review, you'll notice that the same structural patterns repeat. Your pre-market preparation will become faster and more accurate as your scenario library grows.`,
    keyPoints: [
      "Scenario planning replaces reactive decision-making with pre-planned conditional responses",
      "Every scenario follows IF (observable condition) / THEN (AMT-based expectation) / THEREFORE (specific trade action)",
      "Build 2-3 scenarios maximum. more dilutes focus and suggests guessing rather than planning",
      "A scenario that doesn't trigger is not a missed trade. it's the discipline of waiting for your setup",
      "Daily scenario review builds a pattern library that makes future preparation faster and more accurate",
    ],
    relatedArticles: ["amt-initiative-responsive", "amt-gap-rules", "amt-value-area-deep-dive"],
    tags: ["scenario planning", "pre-market", "preparation", "decision making", "trade management"],
  },
  // ============================================================
  // ADVANCED TOPICS
  // ============================================================
  {
    id: "amt-gap-rules",
    title: "Gap Rules: A Systematic Framework for the Open",
    category: "Advanced Topics",
    difficulty: "intermediate",
    readTime: 9,
    summary: "Learn the three gap rules that provide a probabilistic framework for the first trade of the day, based on where price opens relative to the prior session's value area.",
    content: `## Why Gaps Matter

A gap occurs when the current session's opening price is outside the prior session's range. But in AMT, we define gaps more specifically: **a gap occurs when price opens outside the prior day's VALUE AREA.**

This distinction matters because the value area represents the zone of acceptance. a gap above the value area means price has opened where the market has NOT established consensus fair value. This creates a predictable set of outcomes.

## The Three Gap Rules

### Gap Rule 1: Opening Inside Value, Staying in Value
**Setup**: Price opens within the prior day's value area (between VAL and VAH)
**Expected behavior**: Rotation between VAL and VAH
**Trading implications**:
- Expect two-sided, rotational activity
- Responsive long at VAL, responsive short at VAH
- No clear directional bias; initiative trades are lower probability
- This is an "Open-Auction" day type candidate

### Gap Rule 2: Opening Outside Value, Returning to Value
**Setup**: Price opens above VAH or below VAL, then returns inside the value area
**Expected behavior**: Once inside value, price continues to the OPPOSITE boundary
**Trading implications**:
- This is one of the most powerful and reliable patterns in AMT
- If price opens above VAH and returns below VAH: target VAL (or POC as first target)
- If price opens below VAL and returns above VAL: target VAH (or POC as first target)
- Entry: on the confirmed return inside value (acceptance below VAH or above VAL)
- This represents "trapped" participants who bought/sold the gap and are now underwater

### Gap Rule 3: Opening Outside Value, Accepting Outside Value
**Setup**: Price opens above VAH (or below VAL) and ACCEPTS outside the value area
**Expected behavior**: Prior value area becomes the new support/resistance
- If accepted above VAH: VAH becomes support for the new session
- If accepted below VAL: VAL becomes resistance
**Trading implications**:
- This is the true breakout scenario
- Prior value area becomes a reference for pullback entries
- Initiative trades: buy pullbacks to VAH (now support) targeting higher structure
- Do NOT take responsive short at VAH when price has accepted above it

## The Critical Skill: Distinguishing Rule 2 from Rule 3

The most difficult (and most valuable) skill in gap rule application is determining, in real time, whether a gap-up is going to follow Rule 2 (fail and return to value) or Rule 3 (accept and continue).

Key signals that favor Rule 3 (acceptance):
- Opening with an Open-Drive (immediate directional commitment)
- High volume accompanying the gap
- Strong delta (aggressive buyers at the ask)
- Positive market internals (TICK above +800 early)
- Gap aligns with higher timeframe breakout

Key signals that favor Rule 2 (return to value):
- Opening with an Open-Rejection-Reverse (gap is immediately sold)
- Low volume at the gap level
- Negative delta despite higher price (buying the ask has dried up)
- Weak market internals
- Gap against the higher timeframe trend

## Gap Rule Application in Practice

Here's how a professional AMT trader thinks through a gap-up opening:

**Pre-market**: Prior day VAH = 4520, VAL = 4498, POC = 4510. Current overnight high = 4535, current price = 4528.

**Initial assessment**: Price is opening 8 points above prior day VAH. This is a gap open. Immediately apply gap rules.

**Question 1**: Is this a gap that will accept outside value (Rule 3) or return to value (Rule 2)?

**At open**: Watch the first 2-3 candles. Is the opening type an Open-Drive (bullish for Rule 3) or an Open-Rejection-Reverse (bearish, Rule 2 likely)?

**If Open-Drive develops**: Wait for the IB to form. If IB forms above 4520 with 2 closes above, Rule 3 is in effect. Buy pullbacks to 4520.

**If price reverses immediately and returns below 4520**: Rule 2 is in effect. Enter short below 4520 targeting POC at 4510 then VAL at 4498.

**The key**: You don't know which rule will apply until you see how price behaves at the key level. Pre-plan both scenarios; execute based on what actually happens.`,
    keyPoints: [
      "In AMT, a 'gap' is specifically defined as price opening outside the prior session's VALUE AREA",
      "Rule 2 (gap fails, returns to value) is one of the most reliable and powerful patterns in AMT",
      "Rule 3 (gap accepts, prior value becomes support/resistance) is the true breakout scenario",
      "Distinguishing Rule 2 from Rule 3 in real time is the critical skill. use opening type, volume, and delta",
      "Pre-plan both scenarios every morning; your execution depends on what the market does at the key level",
    ],
    relatedArticles: ["amt-acceptance-rejection", "amt-opening-types", "amt-value-area-deep-dive"],
    tags: ["gap rules", "opening", "gaps", "value area", "breakout", "trade setup"],
  },
  {
    id: "amt-order-flow",
    title: "Order Flow Analysis: Reading Conviction Behind Price",
    category: "Advanced Topics",
    difficulty: "advanced",
    readTime: 14,
    summary: "Learn to use delta, footprint charts, and market internals to understand the WHY behind price movement. Order flow analysis is the difference between price action and market intelligence.",
    content: `## Why Price Action Alone Isn't Enough

Price tells you WHAT the market is doing. Order flow tells you WHY.

You can watch price break above a key resistance level and not know whether it's a genuine breakout or a liquidity grab about to reverse. Add order flow, and the picture becomes much clearer:

- Is aggressive buying (market orders at the ask) driving the move? Genuine breakout more likely.
- Is price rising on declining delta? Sellers are absorbing the buying. Reversal likely.
- Are market internals confirming the move? Broad participation. Trend more likely.

Order flow doesn't eliminate uncertainty. nothing does. But it raises the quality of information available for your decisions.

## Delta: The Core Order Flow Metric

Delta measures the net difference between aggressive buying and selling:

**Delta = Volume at Ask (aggressive buyers) - Volume at Bid (aggressive sellers)**

**Positive delta**: More aggressive buying than selling. buyers are willing to pay the offer price to get in.

**Negative delta**: More aggressive selling than buying. sellers are willing to hit the bid to get out.

**Cumulative delta**: The running sum of delta throughout the session. Shows the overall balance of aggressive participation.

### Key Delta Patterns

**Delta divergence (bearish)**:
- Price makes a new high
- But delta is lower than the previous high (or negative)
- Interpretation: Buyers are losing conviction. Price moved higher but fewer aggressive buyers participated. Potential reversal signal.

**Delta divergence (bullish)**:
- Price makes a new low
- But delta is higher (less negative) than the previous low
- Interpretation: Sellers are losing conviction at lower prices. Potential reversal signal.

**Delta exhaustion**:
- Large positive delta spike (massive aggressive buying)
- Accompanied by a candle with a large upper wick
- Interpretation: Buyers flooded the market, but sellers absorbed them all. The buying exhausted itself. Major reversal signal.

**Hidden delta strength**:
- Price declining, but delta remains positive or less negative
- Interpretation: Price is being dropped through passive sell orders (limit orders), but there are still aggressive buyers at lower prices. Potential support.

## Footprint Charts: The Micro-Structure of Price

Footprint charts (also called Order Flow charts or Bid/Ask charts) show the volume traded at each price level WITHIN each candle. This reveals the micro-structure that regular candlestick charts hide.

**Key footprint patterns**:

**Absorption**:
- Large volume at a price level with minimal price movement
- One side is absorbing the other's aggression
- Bearish absorption: Large volume of buyers (positive delta) at a level, but price can't move higher. Sellers are absorbing.
- Bullish absorption: Large volume of sellers (negative delta) at a level, but price can't move lower. Buyers are absorbing.

**Imbalance**:
- At a specific price level, one side (buy or sell) has significantly more volume than the other
- Typical imbalance threshold: 3:1 or more
- Buy imbalance (much more buying than selling at that level) = strong demand at that price
- Imbalances often act as support/resistance because they represent strong participant conviction

**Stacked imbalances**:
- Multiple consecutive price levels with imbalances on the same side
- Strong directional conviction
- Price often moves quickly through the opposite side when returning to this area

## Market Internals: Breadth of Participation

For equity index traders (ES, NQ, etc.), market internals provide crucial context about whether a move has broad participation.

**NYSE TICK**:
- Measures the net number of stocks trading on an uptick vs. downtick
- Range: roughly -1500 to +1500
- +800 to +1000: Strong buying, institutional participation
- -800 to -1000: Strong selling, institutional participation
- Sustained above +500: Bullish confirmation for longs
- Sustained below -500: Bearish confirmation for shorts

**Key TICK patterns**:
- **TICK divergence**: Price makes new high but TICK peak is lower. Weakening breadth. Caution on longs.
- **TICK breadth thrust**: TICK surges to extreme (+1200 or higher) early in the session. Often signals a trending day.
- **TICK mean reversion**: TICK hitting extreme (+1200/-1200) and immediately reversing. Potential short-term fade.

**ADD (Advance-Decline Line)**:
- Net advancing stocks minus declining stocks
- Strong positive ADD confirms that a market rally has broad participation
- Negative ADD diverging from rising price = narrow rally, higher reversal risk

## Integrating Order Flow with AMT

Order flow analysis achieves its maximum value when combined with AMT reference levels:

**Example**: Price pulls back to prior day VAH (now support). Do you buy?

- Without order flow: You see price at a key level and enter based on structure alone.
- With order flow: You see price at VAH AND delta is positive (aggressive buyers are emerging). TICK is above +500. Footprint shows buy imbalances at VAH.

The confluence of AMT structure + order flow confirmation creates some of the highest-probability setups available.

**The rule**: AMT tells you WHERE to look. Order flow tells you IF what you're looking for is actually happening.

Don't enter just because price is at a key level. Wait for order flow to confirm that responsive or initiative participants are actually present at that level.`,
    keyPoints: [
      "Delta measures the net difference between aggressive buying and selling. the 'why' behind price movement",
      "Delta divergence (price makes new high but delta lower) is one of the strongest reversal signals available",
      "Footprint charts reveal absorption (one side stopping the other) and imbalances (strong directional conviction)",
      "NYSE TICK above +800 sustained confirms institutional buying; below -800 confirms institutional selling",
      "AMT tells you WHERE to look; order flow tells you IF what you expect is actually happening at that level",
    ],
    relatedArticles: ["amt-initiative-responsive", "amt-acceptance-rejection", "amt-scenario-planning"],
    tags: ["order flow", "delta", "footprint", "market internals", "TICK", "advanced"],
  },
];

// Helper function to get articles by category
export function getArticlesByCategory(category: string): KnowledgeArticle[] {
  return AMT_KNOWLEDGE_ARTICLES.filter((article) => article.category === category);
}

// Helper function to get articles by difficulty
export function getArticlesByDifficulty(difficulty: "beginner" | "intermediate" | "advanced"): KnowledgeArticle[] {
  return AMT_KNOWLEDGE_ARTICLES.filter((article) => article.difficulty === difficulty);
}

// Helper function to get related articles
export function getRelatedArticles(articleId: string): KnowledgeArticle[] {
  const article = AMT_KNOWLEDGE_ARTICLES.find((a) => a.id === articleId);
  if (!article || !article.relatedArticles) return [];
  return AMT_KNOWLEDGE_ARTICLES.filter((a) => article.relatedArticles!.includes(a.id));
}

// Get all unique categories
export function getAllCategories(): string[] {
  return [...new Set(AMT_KNOWLEDGE_ARTICLES.map((article) => article.category))];
}

// Search articles by tag
export function searchArticlesByTag(tag: string): KnowledgeArticle[] {
  return AMT_KNOWLEDGE_ARTICLES.filter((article) => article.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())));
}

export interface GlossaryTerm {
  term: string;
  shortDef: string;
  fullDef: string;
  category: "core" | "structure" | "participant" | "indicator" | "strategy" | "advanced";
  relatedTerms?: string[];
  examples?: string[];
}

export const AMT_GLOSSARY: GlossaryTerm[] = [
  // CORE CONCEPTS
  {
    term: "Auction Market Theory (AMT)",
    shortDef: "A framework for understanding markets as continuous two-sided auctions seeking price equilibrium.",
    fullDef:
      "Auction Market Theory views markets as ongoing negotiations between buyers and sellers. At any given price, the market is either facilitating trade (finding willing participants on both sides) or advertising for trade (testing prices to find where participants emerge). The market's primary purpose is price discovery. finding the price that best facilitates trade and balances supply and demand.",
    category: "core",
    relatedTerms: ["Value Area", "Point of Control", "Market Profile"],
    examples: [
      "When price moves away from value quickly, it's advertising for responsive participants",
      "Time spent at a price level indicates acceptance. the market has found willing participants",
    ],
  },
  {
    term: "Value Area",
    shortDef: "The price range where approximately 70% of yesterday's volume traded.",
    fullDef:
      "The Value Area represents market-determined fair value. It contains approximately 70% of a session's volume and defines the range where the majority of business was conducted. The Value Area High (VAH) and Value Area Low (VAL) serve as significant reference points. Price above VAH suggests the market is advertising for sellers; price below VAL suggests it's advertising for buyers.",
    category: "core",
    relatedTerms: ["Value Area High", "Value Area Low", "Point of Control", "Acceptance"],
    examples: [
      "Opening above VAH with acceptance signals bullish conviction",
      "Failure to hold above VAH often leads to rotation back to value",
    ],
  },
  {
    term: "Point of Control (POC)",
    shortDef: "The price level with the highest volume during a given session or period.",
    fullDef:
      "The Point of Control is the price level where the most volume (or time in TPO-based profiles) was traded during a given session. It represents the fairest price as determined by the market's participants. The POC acts as a magnet. price tends to revisit the POC before making sustained directional moves. Multiple POCs across sessions can create composite areas of significant support/resistance.",
    category: "core",
    relatedTerms: ["Value Area", "Market Profile", "Volume Profile"],
    examples: [
      "Price repeatedly returns to yesterday's POC during the first hour, indicating acceptance",
      "A gap above POC that holds signals strong buying conviction",
    ],
  },
  {
    term: "Acceptance",
    shortDef: "Price spending sufficient time at a level to indicate market agreement with that value.",
    fullDef:
      "Acceptance occurs when the market demonstrates agreement with a price level through time, volume, and/or repeated visits. It's confirmed by two-sided trade at a level (both buyers and sellers willing to transact). Acceptance above resistance turns it to support; acceptance below support turns it to resistance. Without acceptance, price moves are considered probes or tests, not true breakouts.",
    category: "core",
    relatedTerms: ["Rejection", "Value Area", "Initiative Activity"],
    examples: [
      "Three consecutive 30-minute bars closing above resistance = acceptance",
      "Price tests above VAH but closes back inside = rejection, not acceptance",
    ],
  },
  {
    term: "Rejection",
    shortDef: "Price failing to find acceptance at a level, indicating the market disagrees with that value.",
    fullDef:
      "Rejection is the opposite of acceptance. When price moves to a level but fails to generate two-sided trade, it rejects that price. Rejection is characterized by quick reversals, long wicks, and low volume at the tested level. Strong rejection (especially from key reference points) often produces high-probability responsive trades back toward value. The speed and size of the rejection indicates conviction.",
    category: "core",
    relatedTerms: ["Acceptance", "Responsive Activity", "Value Area"],
    examples: [
      "Price spikes above overnight high but immediately reverses with increased volume = strong rejection",
      "Thin upper wick on a 30-min bar touching VAH = initial rejection",
    ],
  },
  // STRUCTURE CONCEPTS
  {
    term: "Market Profile",
    shortDef: "A time-price-opportunity chart showing where price spent the most time during a session.",
    fullDef:
      "Market Profile, developed by J. Peter Steidlmayer, organizes price and time data into a bell-curve-like distribution. Each letter (TPO) represents a 30-minute period at a price level. The resulting shape reveals the session's structure: whether it was balanced (rotational) or imbalanced (trending). A normal bell curve indicates a balanced, two-sided auction. A skewed or P/b-shaped profile reveals directional conviction.",
    category: "structure",
    relatedTerms: ["TPO", "Value Area", "Point of Control", "Volume Profile"],
    examples: [
      "A P-shaped profile (heavy top, thin bottom) suggests buyers in control, possible short covering",
      "A b-shaped profile suggests sellers in control, possible long liquidation",
    ],
  },
  {
    term: "Volume Profile",
    shortDef: "A chart showing volume traded at each price level over a specified period.",
    fullDef:
      "Volume Profile displays the horizontal distribution of volume at each price level, as opposed to traditional volume bars which show total volume per time period. High-volume nodes (HVNs) represent areas of price acceptance and often act as support/resistance. Low-volume nodes (LVNs) represent areas of price rejection and often act as vacuum zones where price travels quickly. Volume Profile can be applied to any timeframe.",
    category: "structure",
    relatedTerms: ["Market Profile", "High Volume Node", "Low Volume Node", "Point of Control"],
    examples: [
      "LVN between 4500-4510 causes rapid movement through the zone",
      "HVN at 4550 acts as a magnet during pullbacks",
    ],
  },
  {
    term: "Initial Balance (IB)",
    shortDef: "The price range established in the first hour of the regular trading session.",
    fullDef:
      "The Initial Balance (typically the first 60 minutes of the regular session) sets the day's initial framework. The IB range represents the market's first attempt to find value for that session. A narrow IB suggests the market hasn't found direction yet (often precedes a larger range day). A wide IB suggests early conviction. Extensions beyond the IB indicate which side (buyers or sellers) is more dominant.",
    category: "structure",
    relatedTerms: ["IB Extension", "Range Extension", "Opening Types"],
    examples: [
      "IB of only 8 points in ES suggests potential for larger range day",
      "Price extends above IB high by 2+ points with volume = bullish range extension",
    ],
  },
  {
    term: "Composite Profile",
    shortDef: "A volume or TPO profile built over multiple sessions to identify longer-term value areas.",
    fullDef:
      "A Composite Profile aggregates data from multiple sessions (days, weeks, or months) to create a broader picture of where value has been established. Weekly, monthly, or longer composites reveal structural support/resistance zones that aren't visible on daily profiles. High-volume nodes in weekly composites often provide the most reliable reference points for swing traders and longer-term participants.",
    category: "structure",
    relatedTerms: ["Volume Profile", "Market Profile", "Value Area"],
    examples: [
      "Weekly composite VAL at 4480 provides significant support on a pullback",
      "Monthly POC at 4520 acts as a magnet during low-volume periods",
    ],
  },
  {
    term: "Single Prints",
    shortDef: "Price levels with only one TPO letter, indicating rapid movement with minimal acceptance.",
    fullDef:
      "Single prints occur in Market Profile when price passes through a level so quickly that only one 30-minute period (one letter) registers there. They represent areas of strong imbalance and often indicate the beginning or end of a directional move. Single prints created on the way up are bullish gaps that often get filled. Single prints at the top of a range (buying tail) indicate strong sellers. Single prints at the bottom (selling tail) indicate strong buyers.",
    category: "structure",
    relatedTerms: ["TPO", "Market Profile", "Gaps"],
    examples: [
      "Single prints from 4520-4530 on the way up = bullish. likely to be revisited",
      "Selling tail of 3 single prints at the day's low = strong buyer response",
    ],
  },
  // PARTICIPANT CONCEPTS
  {
    term: "Initiative Activity",
    shortDef: "Trades executed away from value, driven by participants with strong directional conviction.",
    fullDef:
      "Initiative activity occurs when participants are willing to transact at prices outside of established value. Initiative buyers lift offers above value; initiative sellers hit bids below value. This activity signals conviction and often precedes range expansion. Initiative trades are higher risk (entering away from value) but offer larger potential rewards if the market accepts the new price area. Confirmation requires acceptance at the new price level.",
    category: "participant",
    relatedTerms: ["Responsive Activity", "Value Area", "Acceptance"],
    examples: [
      "Buying above yesterday's VAH = initiative activity. betting on new value forming higher",
      "Selling below overnight low = initiative activity. conviction that lower prices are fair",
    ],
  },
  {
    term: "Responsive Activity",
    shortDef: "Trades executed at value extremes, driven by participants who view current prices as unfair.",
    fullDef:
      "Responsive activity is the backbone of mean-reversion trading. Responsive buyers emerge below value (viewing prices as too low); responsive sellers emerge above value (viewing prices as too high). This activity drives price back toward established value. Responsive trades are typically higher probability (trading back toward value) but offer smaller reward-to-risk ratios than initiative trades. The confluence of responsive activity with key reference points increases probability.",
    category: "participant",
    relatedTerms: ["Initiative Activity", "Value Area", "Rejection"],
    examples: [
      "Buying at VAL after overnight decline = responsive activity",
      "Selling at VAH after gap-up open = responsive activity",
    ],
  },
  {
    term: "Other Timeframe Participants (OTF)",
    shortDef: "Large institutional participants who move markets with their order flow.",
    fullDef:
      "Other Timeframe Participants are large-scale buyers and sellers (institutions, funds, commercials) whose orders are large enough to move markets and establish new value areas. Identifying OTF activity is crucial. OTF buyers leave footprints through sustained buying pressure, range extensions, and acceptance above prior value. OTF sellers do the opposite. Day traders align with OTF direction for higher probability trades rather than fighting institutional order flow.",
    category: "participant",
    relatedTerms: ["Initiative Activity", "Range Extension", "Volume Profile"],
    examples: [
      "Sustained buying through the IB high with increasing volume = OTF buyer present",
      "Unable to break above VAH after 3 attempts = OTF seller defending the level",
    ],
  },
  // INDICATOR/TOOL CONCEPTS  
  {
    term: "VWAP (Volume-Weighted Average Price)",
    shortDef: "The average price weighted by volume, used as a benchmark for institutional execution.",
    fullDef:
      "VWAP represents the true average price at which all volume has traded during the session, weighted by volume. It's the primary benchmark for institutional traders. Price above VWAP indicates buyers in control; below indicates sellers. Anchored VWAP (anchored to significant highs, lows, or events) extends the concept across multiple sessions. VWAP bands (standard deviations from VWAP) define normal vs. extended price ranges.",
    category: "indicator",
    relatedTerms: ["Anchored VWAP", "Volume Profile", "POC"],
    examples: [
      "Open above VWAP, hold above on first pullback = bullish continuation setup",
      "Reclaim of VWAP after breakdown = potential reversal signal",
    ],
  },
  {
    term: "Delta",
    shortDef: "The difference between buying volume (aggressive buyers) and selling volume (aggressive sellers).",
    fullDef:
      "Delta measures the net difference between trades executed at the ask (aggressive buying) and trades executed at the bid (aggressive selling). Positive delta indicates net buying pressure; negative delta indicates net selling pressure. Cumulative delta shows the running total throughout the session. Divergences between price and delta (price making new highs with declining delta) often signal weakening momentum and potential reversals.",
    category: "indicator",
    relatedTerms: ["Volume Profile", "Footprint Chart", "Order Flow"],
    examples: [
      "Price makes new session high but delta turns negative = bearish divergence",
      "Large positive delta spike at support = aggressive buyers defending level",
    ],
  },
  {
    term: "Footprint Chart",
    shortDef: "A candlestick chart showing the volume traded at each price level within each candle.",
    fullDef:
      "Footprint charts (also called Order Flow charts) reveal the micro-structure within each candle by showing bid/ask volume at every price level. This allows traders to see exactly where buying and selling pressure exists within the bar. Key patterns include: absorption (large volume at a level with minimal price movement), imbalances (significantly more buying than selling at a price), and exhaustion (large volume with no follow-through).",
    category: "indicator",
    relatedTerms: ["Delta", "Order Flow", "Volume Profile"],
    examples: [
      "Large ask absorption at resistance = sellers absorbing buyers. bearish",
      "Bid imbalance at key support = strong buyers present at that level",
    ],
  },
  // STRATEGY CONCEPTS
  {
    term: "Gap Rules",
    shortDef: "A set of principles governing how to trade opening gaps relative to prior value areas.",
    fullDef:
      "Gap Rules provide a framework for the first trade of the day based on how price opens relative to prior value. Gap Rule 1: If price opens in value and stays in value, expect rotation within the prior value area. Gap Rule 2: If price opens outside value and returns to value, expect continuation to the other side of value. Gap Rule 3: If price opens outside value and accepts outside value, the prior value area becomes resistance (for gaps above) or support (for gaps below).",
    category: "strategy",
    relatedTerms: ["Value Area", "Acceptance", "Opening Types"],
    examples: [
      "Gap open above VAH, price accepts above VAH = bullish. look for longs at VAH retest",
      "Gap open above VAH, price returns inside VA = expect rotation to VAL",
    ],
  },
  {
    term: "Opening Types",
    shortDef: "Classification of how the market opens relative to prior structure, indicating likely day type.",
    fullDef:
      "Opening types help predict the likely structure of the trading day: Open-Drive (immediate directional movement from the open. trend day likely), Open-Test-Drive (brief test of a level then strong directional move), Open-Rejection-Reverse (test of a level, rejection, move in opposite direction), Open-Auction (balanced, two-sided trade. rotational day likely). Identifying the opening type early allows traders to frame appropriate expectations for the day's potential range and character.",
    category: "strategy",
    relatedTerms: ["Initial Balance", "Value Area", "Day Types"],
    examples: [
      "Market opens and immediately drives higher with no pullback = Open-Drive. trend day expected",
      "Market opens, tests overnight low, rejects sharply higher = Open-Rejection-Reverse",
    ],
  },
  {
    term: "Scenario Planning",
    shortDef: "Pre-market preparation that defines if/then conditions for potential trade setups.",
    fullDef:
      "Scenario planning is the process of defining 2-4 potential market narratives before the session begins, each with specific trigger conditions, expected outcomes, and trade parameters. Format: IF [condition] THEN [expected outcome] THEREFORE [trade action]. This approach removes real-time decision-making pressure and prevents emotional entries. Each scenario must be validated (acceptance + time + volume) before acting. A scenario that doesn't trigger is not a failed trade. it's discipline.",
    category: "strategy",
    relatedTerms: ["Acceptance", "Initiative Activity", "Responsive Activity"],
    examples: [
      "IF price accepts above VAH THEN look for continuation to prior day high THEREFORE buy pullback to VAH",
      "IF gap fills to VAL THEN responsive buyers expected THEREFORE buy at VAL with stop below",
    ],
  },
  // ADVANCED CONCEPTS
  {
    term: "Liquidity",
    shortDef: "The availability of willing buyers and sellers at a given price level.",
    fullDef:
      "In AMT context, liquidity refers to where resting orders (stops and limit orders) are clustered. Price gravitates toward liquidity pools. stops above prior highs, below prior lows, at round numbers, and at technical levels that many traders watch. Understanding liquidity allows traders to anticipate where price is likely to run before reversing (stop hunts), and where strong support/resistance exists (dense limit order books).",
    category: "advanced",
    relatedTerms: ["Order Flow", "OTF", "Value Area"],
    examples: [
      "Price sweeps above prior day high (running stops) then reverses. typical liquidity grab",
      "Round numbers (4500, 4550) attract resting orders and often see increased two-sided activity",
    ],
  },
  {
    term: "Market Internals",
    shortDef: "Breadth indicators that measure the overall health and direction of market participation.",
    fullDef:
      "Market internals provide context beyond price by measuring the breadth and depth of market participation. Key internals for equity index traders: NYSE TICK (net advancing vs declining stocks per uptick/downtick), ADD (advance-decline line), and VOLD (volume of advancing vs declining stocks). Strong internals (high TICK readings, positive ADD) confirm directional moves. Divergences between price and internals often precede reversals.",
    category: "advanced",
    relatedTerms: ["Delta", "OTF", "Volume Profile"],
    examples: [
      "ES makes new high but TICK fails to confirm (+800 on first high, +400 on second) = weakening breadth",
      "ADD surges positive as price breaks above VAH = broad participation. higher probability continuation",
    ],
  },
  {
    term: "Balance Area",
    shortDef: "A price range where the market has found equilibrium, with no clear directional bias.",
    fullDef:
      "A balance area forms when the market finds equilibrium and both buyers and sellers are satisfied with prices within a range. Balance areas can form over hours (intraday consolidation) or days/weeks (longer-term trading ranges). The edges of balance areas are high-probability responsive trade locations. A breakout from balance with acceptance often leads to a move equal to the size of the balance area. Balance resolves into initiative activity when one side overcomes the other.",
    category: "advanced",
    relatedTerms: ["Value Area", "Initiative Activity", "Responsive Activity"],
    examples: [
      "Three-day balance between 4480-4520. breakout above 4520 with acceptance targets 4560",
      "Intraday balance forming in the first 2 hours suggests afternoon directional move likely",
    ],
  },
];

// Learning modules for the AMT curriculum
export interface LearningModule {
  id: string;
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  concepts: string[];
  keyTakeaways: string[];
  practiceExercises: string[];
}

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: "amt-foundations",
    title: "AMT Foundations: The Auction Process",
    level: "beginner",
    description: "Understand how markets work as continuous two-sided auctions and why price moves the way it does.",
    concepts: ["Auction Market Theory (AMT)", "Value Area", "Acceptance", "Rejection"],
    keyTakeaways: [
      "Markets exist to facilitate trade. they move to find willing participants on both sides",
      "Price spends time at levels that are fair (value) and quickly rejects unfair prices",
      "The Value Area tells you where 70% of business was done. this IS current market consensus",
      "Acceptance requires time AND volume at a level. quick touches are not acceptance",
    ],
    practiceExercises: [
      "On each trading day, identify the prior day's Value Area High, Value Area Low, and Point of Control",
      "Mark the first time price tests the VAH or VAL and note whether it accepts or rejects",
      "Keep a log of gap opens: how often does price return to prior value after a gap?",
    ],
  },
  {
    id: "market-structure",
    title: "Reading Market Structure",
    level: "beginner",
    description: "Learn to read Market Profile and Volume Profile to understand the day's developing structure.",
    concepts: ["Market Profile", "Volume Profile", "Initial Balance", "Point of Control (POC)"],
    keyTakeaways: [
      "The Initial Balance sets the framework for the day. narrow IB = potential trend day",
      "POC is the fairest price as voted by volume. it acts as a magnet",
      "Profile shape tells a story: normal distribution vs. skewed profiles indicate conviction",
      "LVNs are vacuum zones. HVNs are acceptance zones. learn to distinguish them",
    ],
    practiceExercises: [
      "Each morning, note the IB range after the first hour. predict whether today will be range or trend",
      "Identify 3 HVNs and 3 LVNs on the weekly composite. note how price reacts at each",
      "Draw the developing profile shape every 30 minutes and note what it tells you about control",
    ],
  },
  {
    id: "initiative-vs-responsive",
    title: "Initiative vs. Responsive: The Core Trade Types",
    level: "intermediate",
    description: "Master the two fundamental trade types and when to use each one.",
    concepts: ["Initiative Activity", "Responsive Activity", "Other Timeframe Participants (OTF)"],
    keyTakeaways: [
      "Responsive trades (mean-reversion to value) are higher probability but lower reward",
      "Initiative trades (breakouts from value) are lower probability but higher reward",
      "OTF activity is the engine. learn to identify it early and trade with it, not against it",
      "The same setup can be responsive at one timeframe and initiative at another",
    ],
    practiceExercises: [
      "Label each trade you take as initiative or responsive BEFORE entry. review accuracy weekly",
      "For each trade, identify whether OTF buyers or sellers appear to be present",
      "Track your win rate separately for initiative vs. responsive trades over 30 sessions",
    ],
  },
  {
    id: "gap-rules",
    title: "Gap Rules & Opening Types",
    level: "intermediate",
    description: "Develop a systematic approach to the first trade of the day using gap rules and opening type identification.",
    concepts: ["Gap Rules", "Opening Types", "Initial Balance"],
    keyTakeaways: [
      "The open is the highest information moment of the day. most traders waste it",
      "Gap rules give you a probabilistic framework BEFORE price starts moving",
      "Opening type identification within the first 30 minutes frames your entire day",
      "Open-Drive days require a different playbook than Open-Auction days",
    ],
    practiceExercises: [
      "Each morning, classify the open using Gap Rules BEFORE placing any trades",
      "After the first 30 minutes, identify the opening type. log your accuracy over 20 sessions",
      "Paper trade using only Gap Rules for 10 sessions. measure the framework's edge",
    ],
  },
  {
    id: "scenario-planning",
    title: "Scenario Planning: The Professional's Approach",
    level: "intermediate",
    description: "Build a pre-market routine that eliminates reactive trading and replaces it with structured decision-making.",
    concepts: ["Scenario Planning", "Acceptance", "Gap Rules"],
    keyTakeaways: [
      "A scenario that doesn't trigger is not a failed trade. it's discipline",
      "Plan 2-3 scenarios max. more than that and you're not planning, you're guessing",
      "Each scenario needs: IF condition, THEN expectation, THEREFORE action",
      "Review your scenarios after the close. how often did your planned scenario play out?",
    ],
    practiceExercises: [
      "Write 2 scenarios each morning before the open. time-stamp them. review at close",
      "Track scenario hit rate: how often does price reach your trigger condition?",
      "Build a scenario library: the same setups repeat. document each successful scenario pattern",
    ],
  },
  {
    id: "advanced-tools",
    title: "Advanced Tools: Order Flow & Internals",
    level: "advanced",
    description: "Integrate order flow tools and market internals to read conviction behind price movement.",
    concepts: ["Delta", "Footprint Chart", "Market Internals", "Liquidity"],
    keyTakeaways: [
      "Price is the what. order flow is the WHY. internals tell you HOW MANY",
      "Delta divergences are early warning signals for potential reversals",
      "TICK extremes (+1000/-1000) indicate institutional conviction",
      "Liquidity engineering (stop hunts) happens at predictable locations. learn to spot them",
    ],
    practiceExercises: [
      "Before each entry, check: Is delta confirming the move? Are internals supporting it?",
      "Identify 2 liquidity pools each morning (stops above prior high, below prior low)",
      "Study 10 failed breakouts using footprint charts. what was delta doing?",
    ],
  },
];

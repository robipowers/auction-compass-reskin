# Trading Journal & AI Psychologist Epic

> **For Traycer**: This is a comprehensive feature spec for adding Trading Journal and AI Psychologist capabilities to Auction Compass.

---

## Overview

Two interconnected features that transform Auction Compass from a pre-market planning tool into a complete trading performance system:

1. **Trading Journal** - Log trades with screenshots, emotional states, and plan connections
2. **AI Psychologist** - Analyze patterns, provide coaching, track improvement over time

**Key Integration Point**: Link journaled trades back to auction plans and scenarios to provide AI with context like "You planned Scenario 2, but entered early before validation."

---

## Existing Context

> **IMPORTANT**: This workspace already has some journal/coaching infrastructure. Review these before implementation:

- `src/pages/Journal.tsx` - Existing Journal page
- `src/components/TradingCoach.tsx` - Existing Trading Coach component
- `src/components/AICritique.tsx` - AI Critique component (reference for styling)
- `supabase/functions/trading-coach/` - Existing edge function
- `supabase/functions/ai-strategist/` - AI Strategist edge function

**Integrate with or extend these existing components rather than creating duplicates.**

---

## Phase 1: Trading Journal Core

### Database Schema

```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trade_date DATE NOT NULL DEFAULT CURRENT_DATE,
  instrument TEXT NOT NULL,
  direction TEXT CHECK (direction IN ('long', 'short')),
  entry_price DECIMAL,
  exit_price DECIMAL,
  pnl_pips DECIMAL,
  pnl_dollars DECIMAL,
  pre_trade_emotion TEXT[],
  during_trade_emotion TEXT[],
  post_trade_emotion TEXT[],
  what_went_well TEXT,
  what_to_improve TEXT,
  lesson_learned TEXT,
  auction_plan_id UUID REFERENCES auction_plans(id) ON DELETE SET NULL,
  scenario_traded TEXT,
  followed_plan BOOLEAN,
  plan_deviation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE journal_screenshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE journal_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1'
);

CREATE TABLE journal_entry_tags (
  entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES journal_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, tag_id)
);
```

### Emotion Options

```typescript
const EMOTIONS = {
  positive: ['disciplined', 'patient', 'confident', 'focused', 'calm'],
  negative: ['fomo', 'revenge', 'anxious', 'frustrated', 'overconfident', 'tired'],
  neutral: ['uncertain', 'indifferent']
} as const;
```

---

## Phase 2: Plan Linking & Trade Tracking

```sql
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS scenario_validation_status TEXT
  CHECK (scenario_validation_status IN ('validated', 'partially_validated', 'invalidated', 'premature_entry'));
  
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS entry_timing TEXT
  CHECK (entry_timing IN ('on_signal', 'early', 'late', 'missed'));
```

---

## Phase 3: AI Psychologist

### Database Schema

```sql
CREATE TABLE psychologist_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE psychologist_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES psychologist_conversations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE psychologist_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT CHECK (insight_type IN ('pattern', 'correlation', 'strength', 'weakness', 'suggestion')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  supporting_entries UUID[],
  confidence_score DECIMAL,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Edge Function Prompt

The AI Psychologist should analyze journal patterns, provide empathetic coaching, and track emotional drivers. Reference the existing `trading-coach` function.

---

## Phase 4: Progress Tracking

Weekly summaries with:
- Total trades, win rate, P&L
- Emotion patterns detected
- Plan adherence percentage
- Coaching points for next week

---

## Navigation

```typescript
{ name: 'Journal', href: '/journal', icon: BookOpen },
{ name: 'Psychologist', href: '/psychologist', icon: Brain },
```

---

## Verification

- [ ] Phase 1: Create/edit/filter journal entries with screenshots
- [ ] Phase 2: Link entries to auction plans and scenarios
- [ ] Phase 3: Chat with AI Psychologist, view insights
- [ ] Phase 4: Weekly summary generation, dashboard charts

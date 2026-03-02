-- Trading Journal Entries
-- Phase 1: Core journal functionality with emotional tracking

CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Trade Details
  trade_date DATE NOT NULL DEFAULT CURRENT_DATE,
  instrument TEXT NOT NULL,
  direction TEXT CHECK (direction IN ('long', 'short')),
  entry_price DECIMAL,
  exit_price DECIMAL,
  pnl_pips DECIMAL,
  pnl_dollars DECIMAL,
  
  -- Emotional Tracking
  pre_trade_emotion TEXT[], -- ['disciplined', 'patient', 'fomo', 'revenge', 'anxious', 'confident']
  during_trade_emotion TEXT[],
  post_trade_emotion TEXT[],
  
  -- Reflection
  what_went_well TEXT,
  what_to_improve TEXT,
  lesson_learned TEXT,
  
  -- Plan Connection (Phase 2)
  auction_plan_id UUID,
  scenario_traded TEXT,
  followed_plan BOOLEAN,
  plan_deviation_reason TEXT,
  
  -- Phase 2: Trade Tracking
  scenario_validation_status TEXT CHECK (scenario_validation_status IN ('validated', 'partially_validated', 'invalidated', 'premature_entry')),
  entry_timing TEXT CHECK (entry_timing IN ('on_signal', 'early', 'late', 'missed')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Screenshot Attachments
CREATE TABLE IF NOT EXISTS journal_screenshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags for categorization
CREATE TABLE IF NOT EXISTS journal_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1'
);

CREATE TABLE IF NOT EXISTS journal_entry_tags (
  entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES journal_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, tag_id)
);

-- RLS Policies
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entry_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own journal entries"
  ON journal_entries FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage screenshots for their entries"
  ON journal_screenshots FOR ALL
  USING (entry_id IN (SELECT id FROM journal_entries WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own tags"
  ON journal_tags FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their entry tags"
  ON journal_entry_tags FOR ALL
  USING (entry_id IN (SELECT id FROM journal_entries WHERE user_id = auth.uid()));

-- Indexes for performance
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_trade_date ON journal_entries(trade_date);
CREATE INDEX idx_journal_entries_auction_plan ON journal_entries(auction_plan_id);
CREATE INDEX idx_journal_screenshots_entry ON journal_screenshots(entry_id);
CREATE INDEX idx_journal_tags_user ON journal_tags(user_id);

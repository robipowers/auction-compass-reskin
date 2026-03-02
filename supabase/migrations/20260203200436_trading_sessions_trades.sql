-- Migration: Trading Sessions & Trades
-- Phase 5 of UI/UX Modernization spec

-- 1. Trading Sessions table
CREATE TABLE IF NOT EXISTS trading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  auction_plan_id UUID,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  session_phase TEXT CHECK (session_phase IN ('pre-market', 'open', 'mid-session', 'close')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Trades table
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  session_id UUID REFERENCES trading_sessions ON DELETE SET NULL,
  direction TEXT NOT NULL CHECK (direction IN ('long', 'short')),
  entry_price DECIMAL(12, 4) NOT NULL,
  exit_price DECIMAL(12, 4),
  size INTEGER NOT NULL CHECK (size > 0),
  entry_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  exit_time TIMESTAMPTZ,
  pnl DECIMAL(12, 2),
  r_multiple DECIMAL(6, 2),
  notes TEXT,
  scenario_id UUID,
  instrument TEXT DEFAULT 'NQ',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Session Notes table
CREATE TABLE IF NOT EXISTS session_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  session_id UUID REFERENCES trading_sessions ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Scenario Validations table
CREATE TABLE IF NOT EXISTS scenario_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES trading_sessions ON DELETE CASCADE NOT NULL,
  scenario_id UUID NOT NULL,
  validation_state TEXT NOT NULL CHECK (validation_state IN ('inactive', 'in_play', 'validated', 'invalidated')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trading_sessions_user_id ON trading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_sessions_status ON trading_sessions(status);
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_session_id ON trades(session_id);
CREATE INDEX IF NOT EXISTS idx_trades_entry_time ON trades(entry_time);
CREATE INDEX IF NOT EXISTS idx_session_notes_session_id ON session_notes(session_id);
CREATE INDEX IF NOT EXISTS idx_scenario_validations_session_id ON scenario_validations(session_id);

-- Enable RLS
ALTER TABLE trading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_validations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trading_sessions
CREATE POLICY "Users can view own sessions" ON trading_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON trading_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON trading_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON trading_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for trades
CREATE POLICY "Users can view own trades" ON trades
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own trades" ON trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trades" ON trades
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trades" ON trades
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for session_notes
CREATE POLICY "Users can view own session notes" ON session_notes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own session notes" ON session_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own session notes" ON session_notes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own session notes" ON session_notes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for scenario_validations (via session ownership)
CREATE POLICY "Users can view own scenario validations" ON scenario_validations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM trading_sessions ts WHERE ts.id = session_id AND ts.user_id = auth.uid())
  );
CREATE POLICY "Users can create scenario validations for own sessions" ON scenario_validations
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM trading_sessions ts WHERE ts.id = session_id AND ts.user_id = auth.uid())
  );

-- Updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated_at triggers
DROP TRIGGER IF EXISTS trading_sessions_updated_at ON trading_sessions;
CREATE TRIGGER trading_sessions_updated_at
  BEFORE UPDATE ON trading_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trades_updated_at ON trades;
CREATE TRIGGER trades_updated_at
  BEFORE UPDATE ON trades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS session_notes_updated_at ON session_notes;
CREATE TRIGGER session_notes_updated_at
  BEFORE UPDATE ON session_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

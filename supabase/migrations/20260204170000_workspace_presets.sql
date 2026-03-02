-- Workspace presets table for storing user layout configurations
CREATE TABLE IF NOT EXISTS workspace_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  layout JSONB NOT NULL, -- Panel configuration
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_workspace_presets_user_id ON workspace_presets(user_id);

-- Chart annotations table for persisting drawings
CREATE TABLE IF NOT EXISTS chart_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES trading_sessions(id) ON DELETE SET NULL,
  symbol TEXT NOT NULL,
  annotation_type TEXT NOT NULL, -- line, fibonacci, text, etc.
  data JSONB NOT NULL, -- Drawing-specific data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast symbol lookups
CREATE INDEX IF NOT EXISTS idx_chart_annotations_user_symbol ON chart_annotations(user_id, symbol);

-- Market data connections for provider settings
CREATE TABLE IF NOT EXISTS market_data_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  provider TEXT NOT NULL DEFAULT 'mock', -- mock, tradingview, polygon
  api_key_encrypted TEXT, -- Encrypted via Vault
  settings JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session events for detailed activity logging
CREATE TABLE IF NOT EXISTS session_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES trading_sessions(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- scenario_trigger, price_level, note, trade, etc.
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for timeline queries
CREATE INDEX IF NOT EXISTS idx_session_events_session_created ON session_events(session_id, created_at);

-- Enable RLS
ALTER TABLE workspace_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users access own presets" ON workspace_presets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own annotations" ON chart_annotations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own connections" ON market_data_connections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own session events" ON session_events
  FOR ALL USING (auth.uid() = (SELECT user_id FROM trading_sessions WHERE id = session_id));

// Trading Journal Types

export type EmotionCategory = 'positive' | 'negative' | 'neutral';

export const EMOTIONS = {
  positive: ['disciplined', 'patient', 'confident', 'focused', 'calm'] as const,
  negative: ['fomo', 'revenge', 'anxious', 'frustrated', 'overconfident', 'tired'] as const,
  neutral: ['uncertain', 'indifferent'] as const,
} as const;

export type Emotion = 
  | typeof EMOTIONS.positive[number]
  | typeof EMOTIONS.negative[number]
  | typeof EMOTIONS.neutral[number];

export type TradeDirection = 'long' | 'short';

export type ScenarioValidationStatus = 
  | 'validated' 
  | 'partially_validated' 
  | 'invalidated' 
  | 'premature_entry';

export type EntryTiming = 'on_signal' | 'early' | 'late' | 'missed';

export interface JournalEntry {
  id: string;
  user_id: string;
  
  // Trade Details
  trade_date: string;
  instrument: string;
  direction: TradeDirection | null;
  entry_price: number | null;
  exit_price: number | null;
  pnl_pips: number | null;
  pnl_dollars: number | null;
  
  // Emotional Tracking
  pre_trade_emotion: Emotion[];
  during_trade_emotion: Emotion[];
  post_trade_emotion: Emotion[];
  
  // Reflection
  what_went_well: string | null;
  what_to_improve: string | null;
  lesson_learned: string | null;
  
  // Plan Connection
  auction_plan_id: string | null;
  scenario_traded: string | null;
  followed_plan: boolean | null;
  plan_deviation_reason: string | null;
  
  // Trade Tracking
  scenario_validation_status: ScenarioValidationStatus | null;
  entry_timing: EntryTiming | null;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

export interface JournalScreenshot {
  id: string;
  entry_id: string;
  file_path: string;
  caption: string | null;
  created_at: string;
}

export interface JournalTag {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

export interface JournalEntryWithDetails extends JournalEntry {
  screenshots?: JournalScreenshot[];
  tags?: JournalTag[];
}

// Form types for creating/editing
export interface JournalEntryFormData {
  trade_date: string;
  instrument: string;
  direction: TradeDirection | null;
  entry_price: string;
  exit_price: string;
  pnl_pips: string;
  pnl_dollars: string;
  pre_trade_emotion: Emotion[];
  during_trade_emotion: Emotion[];
  post_trade_emotion: Emotion[];
  what_went_well: string;
  what_to_improve: string;
  lesson_learned: string;
  auction_plan_id: string | null;
  scenario_traded: string;
  followed_plan: boolean | null;
  plan_deviation_reason: string;
  scenario_validation_status: ScenarioValidationStatus | null;
  entry_timing: EntryTiming | null;
}

// Stats types
export interface JournalStats {
  totalTrades: number;
  winRate: number;
  totalPnl: number;
  planAdherence: number;
  emotionCorrelations: {
    emotion: Emotion;
    avgPnl: number;
    frequency: number;
    winRate: number;
  }[];
  weeklyTrend: {
    week: string;
    trades: number;
    pnl: number;
    adherence: number;
  }[];
}

// Filter types
export interface JournalFilters {
  dateFrom?: string;
  dateTo?: string;
  instruments?: string[];
  emotions?: Emotion[];
  direction?: TradeDirection;
  pnlMin?: number;
  pnlMax?: number;
  followedPlan?: boolean;
  tags?: string[];
}

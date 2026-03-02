export type DayType =
  | "trend"
  | "normal"
  | "normal_variation"
  | "neutral"
  | "double_distribution"
  | "liquidation";

export type ValueRelationship =
  | "higher"
  | "overlapping_higher"
  | "inside_previous"
  | "overlapping_lower"
  | "lower";

export type Structure = "balanced" | "p_shape" | "b_shape";

export type Inventory = "net_long" | "net_short" | "neutral";

export type OpenRelation = "oiv" | "oav" | "obv" | "gap";

export type Coherence = "ALIGNED" | "CONFLICTED" | "NEUTRAL";

export interface YesterdayContext {
  dayType: DayType;
  valueRelationship: ValueRelationship;
  structure: Structure;
  prominentVpoc: string;
}

export interface TodayContext {
  inventory: Inventory;
  openRelation: OpenRelation;
}

export interface ReferenceLevels {
  overnightHigh: string;
  overnightLow: string;
  yesterdayVah: string;
  yesterdayVal: string;
}

export interface AuctionPlan {
  id: string;
  instrument: string;
  yesterday: YesterdayContext;
  today: TodayContext;
  levels: ReferenceLevels;
  createdAt: Date;
}

export interface Scenario {
  name: string;
  typeOfMove: string;
  inPlay: string;
  lis: string;
  behavior: string;
}

export interface ChecklistItem {
  question: string;
  answer: string;
}

export interface CurrentAuctionState {
  state: string;
  explanation: string;
}

export interface AICritique {
  id: string;
  planId: string;
  currentAuctionState?: CurrentAuctionState;
  coherence: Coherence;
  coherenceExplanation: string;
  structuralObservations: string;
  scenarios: Scenario[];
  inventoryRiskAnalysis?: string;
  primaryRisk: string;
  marketContext: string;
  dailyChecklist: ChecklistItem[];
  createdAt: Date;
}

export interface CoachMessage {
  id: string;
  planId: string;
  role: "user" | "assistant";
  content: string;
  validationStates?: [ValidationStatus, ValidationStatus, ValidationStatus];
  createdAt: Date;
}

export type ValidationStatus =
  | "inactive"
  | "in_play"
  | "partially_validated"
  | "validated"
  | "invalidated";

export interface ScenarioValidation {
  status: ValidationStatus;
  validatedConditions: string[];
  pendingConditions: string[];
  invalidationCondition: string;
  triggerLevel?: string;
}

// Priority order for status (higher = more important)
export const VALIDATION_STATUS_PRIORITY: Record<ValidationStatus, number> = {
  inactive: 0,
  in_play: 1,
  partially_validated: 2,
  validated: 3,
  invalidated: -1, // Special case: invalidated should be dimmed
};

export function parseValidationStatus(statusStr: string): ValidationStatus {
  const normalized = statusStr.toLowerCase().replace(/[\s_-]+/g, '_');
  
  // Check for new states first
  if (normalized.includes('inactive') || normalized === 'inactive') return "inactive";
  if (normalized.includes('in_play') || normalized === 'in play' || normalized === 'in_play') return "in_play";
  
  // Legacy "not_validated" maps to "in_play" by default (scenario is monitoring)
  if (normalized.includes('not_validated') || normalized === 'not validated') return "in_play";
  
  if (normalized.includes('partially')) return "partially_validated";
  if (normalized.includes('validated') && !normalized.includes('not') && !normalized.includes('in') && !normalized.includes('partially')) return "validated";
  if (normalized.includes('invalidated')) return "invalidated";
  
  return "in_play"; // Default to in_play instead of not_validated
}

export const DAY_TYPE_LABELS: Record<DayType, string> = {
  trend: "Trend",
  normal: "Normal",
  normal_variation: "Normal Variation",
  neutral: "Neutral",
  double_distribution: "Double Distribution",
  liquidation: "Liquidation",
};

export const VALUE_RELATIONSHIP_LABELS: Record<ValueRelationship, string> = {
  higher: "Higher",
  overlapping_higher: "Overlapping Higher",
  inside_previous: "Inside Previous",
  overlapping_lower: "Overlapping Lower",
  lower: "Lower",
};

export const STRUCTURE_LABELS: Record<Structure, string> = {
  balanced: "Balanced",
  p_shape: "P-Shape (Initiative Buying)",
  b_shape: "b-Shape (Initiative Selling)",
};

export const INVENTORY_LABELS: Record<Inventory, string> = {
  net_long: "Net Long",
  net_short: "Net Short",
  neutral: "Neutral",
};

export const OPEN_RELATION_LABELS: Record<OpenRelation, string> = {
  oiv: "OIV (Opened Inside Value)",
  oav: "OAV (Opened Above Value)",
  obv: "OBV (Opened Below Value)",
  gap: "GAP (Gap Open)",
};

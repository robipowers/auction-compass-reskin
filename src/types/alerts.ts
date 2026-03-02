// Automated Alerts & Notifications Types

export type AlertPriority = 'critical' | 'important' | 'informational';
export type AlertBehavior = 'fire_once_dismiss' | 'fire_once_disable' | 'repeating';
export type AlertConditionDirection = 'above' | 'below' | 'crosses';
export type AlertConditionType = 'price' | 'structure' | 'scenario';
export type AlertStatus = 'active' | 'triggered' | 'disabled';

export interface Alert {
  id: string;
  user_id: string;
  plan_id?: string | null;
  name: string;
  instrument: string;
  condition_type: AlertConditionType;
  condition_direction: AlertConditionDirection;
  condition_value: number;
  priority: AlertPriority;
  behavior: AlertBehavior;
  persist_after_session: boolean;
  is_active: boolean;
  is_scenario_alert: boolean;
  created_at: string;
  updated_at: string;
}

export interface AlertHistory {
  id: string;
  alert_id?: string | null;
  user_id: string;
  alert_name: string;
  instrument: string;
  condition_direction: AlertConditionDirection;
  condition_value: number;
  priority: AlertPriority;
  triggered_at: string;
  trigger_price: number;
  session_date: string;
  coaching_insight?: string | null;
  created_at: string;
}

export interface AlertSettings {
  user_id: string;
  sounds_enabled: boolean;
  browser_notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Form types
export interface AlertFormData {
  name: string;
  instrument: string;
  condition_direction: AlertConditionDirection;
  condition_value: number;
  priority: AlertPriority;
  behavior: AlertBehavior;
  persist_after_session: boolean;
}

// UI types
export interface AlertWithStatus extends Alert {
  status: AlertStatus;
  lastTriggered?: string;
}

export interface AlertHistoryGrouped {
  sessionDate: string;
  sessionLabel: string;
  alertCount: number;
  alerts: AlertHistory[];
}

// Constants
export const INSTRUMENTS = [
  { value: 'NQ', label: 'NQ (Nasdaq-100 E-mini)' },
  { value: 'ES', label: 'ES (S&P 500 E-mini)' },
  { value: 'YM', label: 'YM (Dow E-mini)' },
  { value: 'RTY', label: 'RTY (Russell 2000 E-mini)' },
] as const;

export const PRIORITY_OPTIONS: { value: AlertPriority; label: string; description: string }[] = [
  { value: 'critical', label: 'Critical', description: 'Urgent tone + modal' },
  { value: 'important', label: 'Important', description: 'Standard alert' },
  { value: 'informational', label: 'Informational', description: 'Subtle chime' },
];

export const BEHAVIOR_OPTIONS: { value: AlertBehavior; label: string }[] = [
  { value: 'fire_once_dismiss', label: 'Fire once and dismiss' },
  { value: 'fire_once_disable', label: 'Fire once and disable' },
  { value: 'repeating', label: 'Repeating' },
];

export const DIRECTION_OPTIONS: { value: AlertConditionDirection; label: string }[] = [
  { value: 'above', label: 'Breaks above' },
  { value: 'below', label: 'Breaks below' },
  { value: 'crosses', label: 'Crosses' },
];

// Scenario State Types for AMT Trading

export type ScenarioState = 
  | 'balance'
  | 'imbalance_up'
  | 'imbalance_down'
  | 'initiative_buying'
  | 'initiative_selling'
  | 'responsive_buying'
  | 'responsive_selling'
  | 'value_area_high'
  | 'value_area_low'
  | 'poc_test'
  | 'range_extension_up'
  | 'range_extension_down';

export interface Scenario {
  id: string;
  name: string;
  state: ScenarioState;
  description: string;
  probability: number; // 0-100
  conditions: string[];
  targets?: string[];
  invalidation?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScenarioProximity {
  scenario: Scenario;
  proximity: number; // 0-100, how close current market is to scenario
  signal: 'approaching' | 'at' | 'triggered' | 'invalidated';
}

export interface MarketContext {
  currentPrice: number;
  valueAreaHigh: number;
  valueAreaLow: number;
  poc: number;
  sessionHigh: number;
  sessionLow: number;
  volume: number;
  trend: 'up' | 'down' | 'sideways';
}

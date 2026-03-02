// Scenario Acceptance Engine
// Implements 5-minute time-based acceptance logic from MVP Scope

import { 
  Scenario, 
  ScenarioState, 
  ScenarioWithProximity, 
  ScenarioStateChange,
  ACCEPTANCE_TIME_MINUTES,
  PROXIMITY_ALERT_POINTS 
} from '@/types/scenarios';

export class ScenarioEngine {
  private scenarios: Map<string, Scenario> = new Map();
  private stateChangeListeners: ((change: ScenarioStateChange) => void)[] = [];

  constructor(initialScenarios: Scenario[] = []) {
    initialScenarios.forEach(s => this.scenarios.set(s.id, s));
  }

  onStateChange(listener: (change: ScenarioStateChange) => void): () => void {
    this.stateChangeListeners.push(listener);
    return () => {
      this.stateChangeListeners = this.stateChangeListeners.filter(l => l !== listener);
    };
  }

  private notifyStateChange(change: ScenarioStateChange): void {
    this.stateChangeListeners.forEach(listener => listener(change));
  }

  private isPriceTriggered(trigger: { level: number; direction: 'above' | 'below' }, currentPrice: number): boolean {
    return trigger.direction === 'above' 
      ? currentPrice > trigger.level 
      : currentPrice < trigger.level;
  }

  private minutesSince(date: Date): number {
    return (Date.now() - date.getTime()) / (1000 * 60);
  }

  checkAcceptance(scenarioId: string, currentPrice: number): ScenarioState {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) return 'inactive';

    const { trigger, state: previousState } = scenario;
    const isTriggered = this.isPriceTriggered(trigger, currentPrice);
    let newState: ScenarioState = previousState;
    let reason = '';

    if (previousState === 'inactive') {
      if (isTriggered) {
        scenario.trigger.triggeredAt = new Date();
        newState = 'triggered';
        reason = `Price crossed ${trigger.direction} ${trigger.level}`;
      }
    } else if (previousState === 'triggered') {
      if (!isTriggered) {
        scenario.trigger.rejectedAt = new Date();
        scenario.trigger.triggeredAt = null;
        newState = 'rejected';
        reason = 'Price reversed before 5-minute acceptance';
      } else if (trigger.triggeredAt) {
        const minutesHeld = this.minutesSince(trigger.triggeredAt);
        if (minutesHeld >= ACCEPTANCE_TIME_MINUTES) {
          scenario.trigger.acceptedAt = new Date();
          newState = 'accepted';
          reason = `Price held ${trigger.direction} ${trigger.level} for ${ACCEPTANCE_TIME_MINUTES} minutes`;
        }
      }
    } else if (previousState === 'rejected') {
      if (isTriggered) {
        scenario.trigger.triggeredAt = new Date();
        scenario.trigger.rejectedAt = null;
        newState = 'triggered';
        reason = `Re-triggered: Price crossed ${trigger.direction} ${trigger.level}`;
      }
    }

    if (newState !== previousState) {
      scenario.state = newState;
      scenario.updatedAt = new Date();
      this.scenarios.set(scenarioId, scenario);

      const change: ScenarioStateChange = {
        scenarioId,
        previousState,
        newState,
        timestamp: new Date(),
        triggerPrice: currentPrice,
        reason,
      };
      this.notifyStateChange(change);
    }

    return newState;
  }

  getScenarioWithProximity(scenarioId: string, currentPrice: number): ScenarioWithProximity | null {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) return null;

    const { trigger } = scenario;
    const distance = Math.abs(currentPrice - trigger.level);
    const proximityPercent = Math.max(0, 100 - (distance / trigger.level) * 100 * 10);
    
    let holdTimeMinutes: number | null = null;
    if (scenario.state === 'triggered' && trigger.triggeredAt) {
      holdTimeMinutes = this.minutesSince(trigger.triggeredAt);
    }

    return {
      ...scenario,
      proximityPoints: distance,
      proximityPercent,
      isApproaching: distance <= PROXIMITY_ALERT_POINTS,
      holdTimeMinutes,
    };
  }

  processAllScenarios(currentPrice: number): ScenarioWithProximity[] {
    const results: ScenarioWithProximity[] = [];
    this.scenarios.forEach((scenario) => {
      this.checkAcceptance(scenario.id, currentPrice);
      const withProximity = this.getScenarioWithProximity(scenario.id, currentPrice);
      if (withProximity) results.push(withProximity);
    });
    return results;
  }

  overrideState(scenarioId: string, newState: ScenarioState, reason: string = 'Manual override'): void {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) return;

    const previousState = scenario.state;
    scenario.state = newState;
    scenario.updatedAt = new Date();
    this.scenarios.set(scenarioId, scenario);

    this.notifyStateChange({
      scenarioId,
      previousState,
      newState,
      timestamp: new Date(),
      triggerPrice: 0,
      reason,
    });
  }

  resetScenario(scenarioId: string): void {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) return;

    scenario.state = 'inactive';
    scenario.trigger.triggeredAt = null;
    scenario.trigger.acceptedAt = null;
    scenario.trigger.rejectedAt = null;
    scenario.updatedAt = new Date();
    this.scenarios.set(scenarioId, scenario);
  }

  upsertScenario(scenario: Scenario): void {
    this.scenarios.set(scenario.id, scenario);
  }

  getAllScenarios(): Scenario[] {
    return Array.from(this.scenarios.values());
  }

  getScenario(scenarioId: string): Scenario | undefined {
    return this.scenarios.get(scenarioId);
  }
}

let engineInstance: ScenarioEngine | null = null;

export function getScenarioEngine(initialScenarios?: Scenario[]): ScenarioEngine {
  if (!engineInstance) {
    engineInstance = new ScenarioEngine(initialScenarios);
  }
  return engineInstance;
}

export function resetScenarioEngine(): void {
  engineInstance = null;
}

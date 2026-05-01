import type { CatStats, Cooldowns } from '../types/game';

export const INITIAL_STATS: CatStats = {
  hunger: 80,
  happiness: 80,
  cleanliness: 80,
  thirst: 80,
  energy: 100,
};

export const DECAY_RATES_PER_MINUTE: CatStats = {
  hunger: 3,
  happiness: 2,
  cleanliness: 4,
  thirst: 2.5,
  energy: 1.5,
};

export const ACTION_COOLDOWNS: Cooldowns = {
  clean: 30000,
  feed: 10000,
  water: 15000,
  play: 20000,
};

export const ACTION_EFFECTS: Record<string, Partial<CatStats>> = {
  clean: { cleanliness: 80 },
  feed: { hunger: 30 },
  water: { thirst: 70 },
  play: { happiness: 30, energy: -20 },
};

export const THRESHOLDS = {
  warning: 40,
  critical: 20,
  sleeping: 15,
};

export const FISHING_CONFIG = {
  smallFish: { successRate: 0.6, reward: 1 },
  mediumFish: { successRate: 0.4, reward: 2 },
  largeFish: { successRate: 0.2, reward: 3 },
};
export type StatName = 'hunger' | 'happiness' | 'cleanliness' | 'thirst' | 'energy';

export type CatState =
  | 'happy'
  | 'content'
  | 'hungry'
  | 'thirsty'
  | 'dirty'
  | 'tired'
  | 'sleeping'
  | 'angry';

export type ActionType = 'clean' | 'feed' | 'water' | 'play' | 'fish';

export type FishSize = 'small' | 'medium' | 'large';

export interface CatStats {
  hunger: number;
  happiness: number;
  cleanliness: number;
  thirst: number;
  energy: number;
}

export interface Cooldowns {
  clean: number;
  feed: number;
  water: number;
  play: number;
}

export interface Inventory {
  fish: number;
}

export interface GameState {
  cat: CatStats;
  inventory: Inventory;
  cooldowns: Cooldowns;
  lastUpdate: number;
  currentScene: 'main' | 'fishing' | 'settings';
}

export interface ActionResult {
  stat: StatName;
  amount: number;
  message: string;
}
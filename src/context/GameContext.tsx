import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { GameState, CatStats, ActionType, CatState } from '../types/game';
import { INITIAL_STATS, DECAY_RATES_PER_MINUTE, THRESHOLDS } from '../utils/constants';

type GameAction =
  | { type: 'PERFORM_ACTION'; payload: ActionType }
  | { type: 'TICK'; payload: number }
  | { type: 'ADD_FISH'; payload: number }
  | { type: 'SET_SCENE'; payload: GameState['currentScene'] }
  | { type: 'LOAD_GAME'; payload: GameState }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  cat: INITIAL_STATS,
  inventory: { fish: 0 },
  cooldowns: { clean: 0, feed: 0, water: 0, play: 0 },
  lastUpdate: Date.now(),
  currentScene: 'main',
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function calculateCatState(cat: CatStats): CatState {
  const now = new Date();
  const isNightTime = now.getHours() >= 22 || now.getHours() < 7;

  if (isNightTime || cat.energy < THRESHOLDS.sleeping) {
    return 'sleeping';
  }

  const minStat = Math.min(cat.hunger, cat.happiness, cat.cleanliness, cat.thirst, cat.energy);

  if (minStat < 15) {
    return 'angry';
  }

  if (minStat < THRESHOLDS.warning) {
    if (cat.hunger < THRESHOLDS.warning) return 'hungry';
    if (cat.thirst < THRESHOLDS.warning) return 'thirsty';
    if (cat.cleanliness < THRESHOLDS.warning) return 'dirty';
    if (cat.energy < THRESHOLDS.warning) return 'tired';
    if (cat.happiness < THRESHOLDS.warning) return 'content';
  }

  if (cat.hunger > 60 && cat.happiness > 60 && cat.cleanliness > 60) {
    return 'happy';
  }

  return 'content';
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TICK': {
      const deltaSeconds = (action.payload - state.lastUpdate) / 1000;
      const deltaMinutes = deltaSeconds / 60;

      const newCat: CatStats = {
        hunger: clamp(state.cat.hunger - DECAY_RATES_PER_MINUTE.hunger * deltaMinutes, 0, 100),
        happiness: clamp(state.cat.happiness - DECAY_RATES_PER_MINUTE.happiness * deltaMinutes, 0, 100),
        cleanliness: clamp(state.cat.cleanliness - DECAY_RATES_PER_MINUTE.cleanliness * deltaMinutes, 0, 100),
        thirst: clamp(state.cat.thirst - DECAY_RATES_PER_MINUTE.thirst * deltaMinutes, 0, 100),
        energy: clamp(state.cat.energy - DECAY_RATES_PER_MINUTE.energy * deltaMinutes, 0, 100),
      };

      const newCooldowns = { ...state.cooldowns };
      for (const key of Object.keys(newCooldowns) as (keyof typeof state.cooldowns)[]) {
        if (newCooldowns[key] > 0) {
          newCooldowns[key] = Math.max(0, newCooldowns[key] - deltaSeconds * 1000);
        }
      }

      return {
        ...state,
        cat: newCat,
        cooldowns: newCooldowns,
        lastUpdate: action.payload,
      };
    }

    case 'PERFORM_ACTION': {
      const newCooldowns = { ...state.cooldowns };
      const cooldownMap: Record<ActionType, keyof typeof newCooldowns> = {
        clean: 'clean',
        feed: 'feed',
        water: 'water',
        play: 'play',
        fish: 'play',
      };

      const cooldownKey = cooldownMap[action.payload];
      if (newCooldowns[cooldownKey] > 0) {
        return state;
      }

      const effects: Record<ActionType, Partial<CatStats>> = {
        clean: { cleanliness: 80 },
        feed: { hunger: 30 },
        water: { thirst: 70 },
        play: { happiness: 30, energy: -20 },
        fish: {},
      };

      const newCat = { ...state.cat };
      const effect = effects[action.payload];
      for (const [stat, amount] of Object.entries(effect)) {
        const statKey = stat as keyof CatStats;
        newCat[statKey] = clamp(newCat[statKey] + (amount as number), 0, 100);
      }

      const cooldownDurations: Record<ActionType, number> = {
        clean: 30000,
        feed: 10000,
        water: 15000,
        play: 20000,
        fish: 20000,
      };

      newCooldowns[cooldownKey] = cooldownDurations[action.payload];

      return {
        ...state,
        cat: newCat,
        cooldowns: newCooldowns,
      };
    }

    case 'ADD_FISH': {
      return {
        ...state,
        inventory: {
          ...state.inventory,
          fish: state.inventory.fish + action.payload,
        },
      };
    }

    case 'SET_SCENE': {
      return {
        ...state,
        currentScene: action.payload,
      };
    }

    case 'LOAD_GAME': {
      return action.payload;
    }

    case 'RESET_GAME': {
      return initialState;
    }

    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  catState: CatState;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('catPetGame');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GameState;
        dispatch({ type: 'LOAD_GAME', payload: parsed });
      } catch (e) {
        console.error('Failed to load game state');
      }
    }
  }, []);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem('catPetGame', JSON.stringify(state));
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [state]);

  const catState = calculateCatState(state.cat);

  return (
    <GameContext.Provider value={{ state, dispatch, catState }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
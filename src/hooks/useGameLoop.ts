import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

export function useGameLoop(interval: number = 1000) {
  const { dispatch } = useGame();
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      dispatch({ type: 'TICK', payload: now });
      lastTickRef.current = now;
    };

    const intervalId = setInterval(tick, interval);
    return () => clearInterval(intervalId);
  }, [dispatch, interval]);
}
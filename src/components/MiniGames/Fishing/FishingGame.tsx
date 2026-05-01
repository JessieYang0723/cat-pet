import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../../context/GameContext';
import styles from './FishingGame.module.css';

const FISH_TYPES = [
  { type: 'small', emoji: '🐟', successRate: 0.6, reward: 1, speed: 2 },
  { type: 'medium', emoji: '🐠', successRate: 0.4, reward: 2, speed: 1.5 },
  { type: 'large', emoji: '🐡', successRate: 0.2, reward: 3, speed: 1 },
] as const;

export function FishingGame() {
  const { dispatch } = useGame();
  const [fishTypeIndex] = useState(0);
  const [fishPosition, setFishPosition] = useState(50);
  const [direction, setDirection] = useState(1);
  const [isCatchZoneActive, setIsCatchZoneActive] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentFish = FISH_TYPES[fishTypeIndex];
  const catchZoneStart = 35;
  const catchZoneEnd = 65;

  const resetFish = useCallback(() => {
    setFishPosition(Math.random() * 100);
    setDirection(Math.random() > 0.5 ? 1 : -1);
    setIsCatchZoneActive(false);
    setResult(null);
    setIsAnimating(false);
  }, []);

  useEffect(() => {
    if (isAnimating) return;

    const interval = setInterval(() => {
      setFishPosition((prev) => {
        let newPos = prev + currentFish.speed * direction;
        if (newPos >= 90) {
          setDirection(-1);
          newPos = 90;
        } else if (newPos <= 10) {
          setDirection(1);
          newPos = 10;
        }
        return newPos;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [direction, currentFish.speed, isAnimating]);

  useEffect(() => {
    const inZone = fishPosition >= catchZoneStart && fishPosition <= catchZoneEnd;
    setIsCatchZoneActive(inZone);
  }, [fishPosition]);

  const handleCatch = () => {
    if (isAnimating || result) return;

    setIsAnimating(true);
    const inZone = fishPosition >= catchZoneStart && fishPosition <= catchZoneEnd;

    if (inZone) {
      const roll = Math.random();
      if (roll < currentFish.successRate) {
        dispatch({ type: 'ADD_FISH', payload: currentFish.reward });
        setResult({ success: true, message: `钓到了 ${currentFish.reward} 条鱼！` });
      } else {
        setResult({ success: false, message: '鱼跑掉了...' });
      }
    } else {
      setResult({ success: false, message: '没按准！鱼跑了...' });
    }

    setTimeout(() => {
      resetFish();
    }, 1500);
  };

  const handleClose = () => {
    dispatch({ type: 'SET_SCENE', payload: 'main' });
  };

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={handleClose}>✕</button>

      <h2 className={styles.title}>🎣 钓鱼</h2>

      <div className={styles.score}>
        点击鱼儿捕捉它！
      </div>

      <div className={styles.gameArea} onClick={handleCatch}>
        {/* Fishing line */}
        <div className={styles.fishingLine}>
          <div className={styles.hook} />
        </div>

        {/* Catch zone indicator */}
        <div
          className={`${styles.catchZone} ${isCatchZoneActive ? styles.active : ''}`}
          style={{
            left: `${catchZoneStart}%`,
            width: `${catchZoneEnd - catchZoneStart}%`,
          }}
        >
          <span className={styles.catchHint}>
            {isCatchZoneActive ? '✓ 时机到了！' : '等待中...'}
          </span>
        </div>

        {/* Fish */}
        <div
          className={styles.fishShadow}
          style={{
            left: `${fishPosition}%`,
            transform: `translateX(-50%) scaleX(${direction > 0 ? 1 : -1})`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleCatch();
          }}
        >
          <div className={styles.fish}>
            {currentFish.emoji}
          </div>
        </div>

        {/* Dock */}
        <div className={styles.dock} />

        {/* Result overlay */}
        {result && (
          <div className={`${styles.result} ${result.success ? styles.success : styles.fail}`}>
            {result.message}
          </div>
        )}
      </div>

      <p className={styles.instructions}>
        当鱼进入红色区域时点击捕捉！
      </p>
    </div>
  );
}
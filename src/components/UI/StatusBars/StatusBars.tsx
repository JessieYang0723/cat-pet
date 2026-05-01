import { useGame } from '../../../context/GameContext';
import styles from './StatusBars.module.css';

const STAT_CONFIG = [
  { key: 'hunger', label: '饱腹', icon: '🍖' },
  { key: 'happiness', label: '开心', icon: '❤️' },
  { key: 'cleanliness', label: '清洁', icon: '✨' },
  { key: 'thirst', label: '口渴', icon: '💧' },
  { key: 'energy', label: '精力', icon: '⚡' },
] as const;

export function StatusBars() {
  const { state } = useGame();

  const getBarClass = (value: number): string => {
    if (value > 60) return styles.high;
    if (value > 30) return styles.medium;
    return styles.low;
  };

  return (
    <div className={styles.container}>
      {STAT_CONFIG.map(({ key, label, icon }) => {
        const value = state.cat[key];
        return (
          <div key={key} className={styles.statRow}>
            <span className={styles.icon}>{icon}</span>
            <span className={styles.label}>{label}</span>
            <div className={styles.barContainer}>
              <div
                className={`${styles.bar} ${getBarClass(value)}`}
                style={{ width: `${value}%` }}
              />
            </div>
            <span className={styles.value}>{Math.round(value)}</span>
          </div>
        );
      })}
    </div>
  );
}
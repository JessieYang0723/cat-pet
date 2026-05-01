import { useGame } from '../../../context/GameContext';
import type { ActionType } from '../../../types/game';
import styles from './ActionBar.module.css';

const ACTIONS: { action: ActionType; icon: string; label: string; cooldownKey: 'clean' | 'feed' | 'water' | 'play' }[] = [
  { action: 'clean', icon: '🧹', label: '铲屎', cooldownKey: 'clean' },
  { action: 'feed', icon: '🍖', label: '喂食', cooldownKey: 'feed' },
  { action: 'water', icon: '💧', label: '换水', cooldownKey: 'water' },
  { action: 'play', icon: '🎾', label: '玩耍', cooldownKey: 'play' },
  { action: 'fish', icon: '🎣', label: '钓鱼', cooldownKey: 'play' },
];

export function ActionBar() {
  const { state, dispatch } = useGame();

  const handleAction = (action: ActionType) => {
    if (action === 'fish') {
      dispatch({ type: 'SET_SCENE', payload: 'fishing' });
    } else {
      dispatch({ type: 'PERFORM_ACTION', payload: action });
    }
  };

  return (
    <div className={styles.container}>
      {ACTIONS.map(({ action, icon, label, cooldownKey }) => {
        const cooldown = state.cooldowns[cooldownKey];
        const isCooling = cooldown > 0;

        return (
          <button
            key={action}
            className={`${styles.button} ${isCooling ? styles.cooling : ''} ${action === 'fish' ? styles.fishButton : ''}`}
            onClick={() => handleAction(action)}
            disabled={isCooling && action !== 'fish'}
          >
            <span className={styles.icon}>{icon}</span>
            <span className={styles.label}>{label}</span>
            {isCooling && action !== 'fish' && (
              <span className={styles.cooldownText}>{Math.ceil(cooldown / 1000)}s</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
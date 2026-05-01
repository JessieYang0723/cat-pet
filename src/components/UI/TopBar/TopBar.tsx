import { useGame } from '../../../context/GameContext';
import styles from './TopBar.module.css';

export function TopBar() {
  const { state, dispatch } = useGame();

  const handleReset = () => {
    if (confirm('确定要重置游戏吗？所有进度将丢失！')) {
      dispatch({ type: 'RESET_GAME' });
    }
  };

  const handleOpenSettings = () => {
    dispatch({ type: 'SET_SCENE', payload: 'settings' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.fishCount}>
          <span>🐟</span>
          <span>{state.inventory.fish}</span>
        </div>
      </div>

      <div className={styles.center}>
        {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
      </div>

      <div className={styles.right}>
        <button className={styles.resetButton} onClick={handleReset}>
          重置
        </button>
        <button className={styles.settingsButton} onClick={handleOpenSettings}>
          ⚙️
        </button>
      </div>
    </div>
  );
}
import { useGame } from '../../context/GameContext';
import { useGameLoop } from '../../hooks/useGameLoop';
import { TopBar } from '../UI/TopBar/TopBar';
import { StatusBars } from '../UI/StatusBars/StatusBars';
import { ActionBar } from '../UI/ActionBar/ActionBar';
import { Cat } from '../Cat/Cat';
import { FishingGame } from '../MiniGames/Fishing/FishingGame';
import styles from './Game.module.css';

const CAT_STATE_LABELS: Record<string, string> = {
  happy: '喵喵很开心~',
  content: '喵喵很满足',
  hungry: '喵喵饿了...',
  thirsty: '喵喵渴了...',
  dirty: '猫砂该清理了',
  tired: '喵喵有点累',
  sleeping: '喵喵在睡觉...',
  angry: '喵喵生气了！',
};

export function Game() {
  const { state, catState } = useGame();
  useGameLoop(1000);

  if (state.currentScene === 'fishing') {
    return <FishingGame />;
  }

  if (state.currentScene === 'settings') {
    return (
      <div className={styles.container}>
        <div className={styles.mainArea}>
          <h2>⚙️ 设置</h2>
          <p>功能开发中...</p>
          <button onClick={() => {
            // Would dispatch SET_SCENE main here
          }}>
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TopBar />

      <div className={styles.mainArea}>
        <div className={styles.catState}>
          {CAT_STATE_LABELS[catState]}
        </div>

        <StatusBars />

        <Cat />
      </div>

      <ActionBar />
    </div>
  );
}
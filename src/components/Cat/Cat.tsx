import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import styles from './Cat.module.css';

export function Cat() {
  const { catState } = useGame();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  const getParticles = () => {
    switch (catState) {
      case 'happy':
        return (
          <>
            <span className={`${styles.particle} ${styles.heart}`} style={{ top: '20%', left: '20%', animationDelay: '0s' }}>♥</span>
            <span className={`${styles.particle} ${styles.heart}`} style={{ top: '30%', right: '20%', animationDelay: '0.5s' }}>♥</span>
          </>
        );
      case 'sleeping':
        return (
          <>
            <span className={`${styles.particle} ${styles.zzz}`} style={{ top: '10%', left: '30%', animationDelay: '0s' }}>Z</span>
            <span className={`${styles.particle} ${styles.zzz}`} style={{ top: '5%', left: '40%', animationDelay: '0.3s' }}>z</span>
            <span className={`${styles.particle} ${styles.zzz}`} style={{ top: '0%', left: '50%', animationDelay: '0.6s' }}>z</span>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.catContainer} ${styles[catState]}`}>
      <div className={styles.particles}>
        {getParticles()}
      </div>

      <div
        className={`${styles.cat} ${isClicked ? styles.clicked : ''}`}
        onClick={handleClick}
      >
        {/* Body */}
        <div className={styles.body} />

        {/* Head */}
        <div className={styles.head}>
          <div className={styles.ears}>
            <div className={`${styles.ear} ${styles.left}`} />
            <div className={`${styles.ear} ${styles.right}`} />
          </div>
          <div className={styles.face}>
            <div className={styles.eyes}>
              <div className={styles.eye} />
              <div className={styles.eye} />
            </div>
            <div className={styles.nose} />
            <div className={styles.mouth}>
              <div className={`${styles.mouthLine} ${styles.left}`} />
              <div className={`${styles.mouthLine} ${styles.right}`} />
            </div>
            <div className={styles.whiskers}>
              <div className={`${styles.whisker} ${styles.left1}`} />
              <div className={`${styles.whisker} ${styles.left2}`} />
              <div className={`${styles.whisker} ${styles.left3}`} />
              <div className={`${styles.whisker} ${styles.right1}`} />
              <div className={`${styles.whisker} ${styles.right2}`} />
              <div className={`${styles.whisker} ${styles.right3}`} />
            </div>
          </div>
        </div>

        {/* Tail */}
        <div className={styles.tail} />

        {/* Paws */}
        <div className={styles.paws}>
          <div className={styles.paw} />
          <div className={styles.paw} />
        </div>
      </div>
    </div>
  );
}
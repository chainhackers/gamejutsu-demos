import React from 'react';
import { MyGameCardPropsI } from './MyGameCardProps';
import styles from './MyGameCard.module.scss';

export const MyGameCard: React.FC<MyGameCardPropsI> = () => {
  const gameId = 742;
  const proposer = '123';
  const statusTitle = 'Waiting for players';

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.row}>
          <p className={styles.gameId}>{gameId}</p>
          <div className={styles.stakeFrame}></div>
          <p className={styles.proposer}>{proposer}</p>
        </div>
        <div className={styles.row}>
          <button className={styles.btn}>Back to game</button>
          <div className={styles.gradientBorder}>
            <button className={styles.gradientBtn}>Cancel</button>
          </div>
        </div>
      </div>
      <div className={styles.status}>
        <p className={styles.statusTitle}>{statusTitle}</p>
        <div className={styles.statusImage}></div>
      </div>
    </div>
  );
};

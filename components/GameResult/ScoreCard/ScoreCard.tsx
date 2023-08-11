import React from 'react';
import styles from './ScoreCard.module.scss';
import { ScoreCardProps } from './ScoreCardProps';
import Image from 'next/image';
export const ScoreCard = (props: ScoreCardProps) => {
  const { playerName, result, avatarUrl, showWinText, icon } = props;
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.card} ${result === 'winner' ? styles.highlight : ''}`}>
        {result === 'winner' && showWinText && <p className={styles.titleColor}>Winner!</p>}
        <div className={styles.containerPlayer}>
          <Image src={avatarUrl} alt='Player' width={24} height={24} />
          <p className={styles.addressPlayer}>{playerName}</p>
          {icon}
        </div>
      </div>
    </div>
  );
};

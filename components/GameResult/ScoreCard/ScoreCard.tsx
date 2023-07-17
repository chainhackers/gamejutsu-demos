import React, { useState } from 'react';
import styles from './ScoreCard.module.scss';
import { ScoreCardProps } from './ScoreCardProps';
import Image from 'next/image';
import { PawnIcon } from 'components/shared/ui/PawnIcon/PawnIcon';
export const ScoreCard = (props: ScoreCardProps) => {
  const { playerName, result, playerImg, showWinText } = props;
  const [highlight, setHighlight] = useState(false);

  const handleHighlight = () => {
    setHighlight(true);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${highlight ? styles.highlight : ''}`}>
        {result === 'win' && showWinText && <p>Winner!</p>}
        <div className={styles.containerPlayer}>
          <Image src={playerImg} alt='Player' width={24} height={24} />
          <p className={styles.addressPlayer}>{playerName}</p>
          <PawnIcon />
        </div>
      </div>
    </div>
  );
};


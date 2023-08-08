import React, { useState } from 'react';
import styles from './ScoreCard.module.scss';
import { ScoreCardProps } from './ScoreCardProps';
import Image from 'next/image';
import { PawnIcon } from 'components/shared/ui/PawnIcon/PawnIcon';
import { OIcon, XIcon } from 'components/shared/ui/XOIcons';
export const ScoreCard = (props: ScoreCardProps) => {
  const { playerName, result, playerImg, showWinText, gameType } = props;
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.card} ${result === 'win' ? styles.highlight : ''}`}>
        {result === 'win' && showWinText && <p className={styles.titleColor}>Winner!</p>}
        <div className={styles.containerPlayer}>
          <Image src={playerImg} alt='Player' width={24} height={24} />
          <p className={styles.addressPlayer}>{playerName}</p>
          {gameType === 'tic-tac-toe' ? result === 'win' ? <OIcon /> : <XIcon /> : gameType === 'checkers' ? <PawnIcon result={result} /> : null}
        </div>
      </div>
    </div>
  );
};

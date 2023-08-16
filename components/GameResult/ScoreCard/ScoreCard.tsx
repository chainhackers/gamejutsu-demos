import React, { useState } from 'react';
import styles from './ScoreCard.module.scss';
import { ScoreCardProps } from './ScoreCardProps';
import Image from 'next/image';
import { FinishedGameState } from 'gameApi';
export const ScoreCard = (props: ScoreCardProps) => {
  const { playerImg, showWinText, icon, playerIndex, players, finishGameCheckResult } = props;
const [finishedGameState, setFinishedGameState] = useState<FinishedGameState | null>(null);
  
  const playerData = players ? players[playerIndex] : null;
  // console.log('CLAIM WIN  onClaimWin ', onClaimWin);
  console.log('FINISH finishedGameState ', finishedGameState);
  console.log('FINISH finishGameCheckResult ', finishGameCheckResult);
  console.log('PLAYERS ', players);
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.card} ${finishGameCheckResult?.winner ? styles.highlight : ''}`}>
        {finishGameCheckResult?.winner && showWinText && <p className={styles.titleColor}>Winner!</p>}
        <div className={styles.containerPlayer}>
          <Image src={playerImg} alt='Player' width={24} height={24} />
          <p className={styles.addressPlayer}>{playerData?.playerName}</p>
          {icon}
        </div>
      </div>
    </div>
  );
};

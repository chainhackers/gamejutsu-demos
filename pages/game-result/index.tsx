import { useState } from 'react';
import { GameResult } from 'components/GameResult';
import { TGameType } from 'types/game';
import styles from './gameResult.module.scss';
import { FinishedGameState } from 'gameApi/index';
import { useRouter } from 'next/router';

const GameResultPage = () => {
  const [finishedGameState, setFinishedGameState] = useState<FinishedGameState | null>(null);
  const router = useRouter();
  const getGameType = router.query.gameType as TGameType;
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>{finishedGameState && <GameResult gameType={getGameType} result={'winner'} player1={null} player2={null} />}</div>
    </div>
  );
};

export default GameResultPage;

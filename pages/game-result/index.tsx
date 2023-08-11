import { useState } from 'react';
import { GameResult } from 'components/GameResult';
import { TGameType } from 'types/game';
import styles from './gameResult.module.scss';
import { FinishedGameState } from 'gameApi/index';
import { useRouter } from 'next/router';

const GameResultPage = () => {
const [finishedGameState, setFinishedGameState] = useState<FinishedGameState | null>(null);
const router = useRouter();
const dynamicGameType = router.query.gameType as TGameType;
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {finishedGameState && (
          <GameResult
            result={finishedGameState.winner ? 'winner' : finishedGameState.isDraw ? 'isDraw' : 'loser'}
            gameType={dynamicGameType}
            player1={{
              playerName: finishedGameState.winner ? 'playerName' : 'Opponent Name',
              avatarUrl: '',
            }}
            player2={{
              playerName: finishedGameState.winner ? 'Opponent Name' : 'Your Name',
              avatarUrl: '',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GameResultPage;

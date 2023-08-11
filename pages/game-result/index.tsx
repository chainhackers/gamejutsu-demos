import { useState } from 'react';
import { GameResult } from 'components/GameResult';
import { TGameResult } from 'components/GameResult/GameResultProps';
import styles from './gameResult.module.scss';
import { FinishedGameState, finishGame } from 'gameApi/index';

const GameResultPage = () => {
const [finishedGameState, setFinishedGameState] = useState<FinishedGameState | null>(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {finishedGameState && (
          <GameResult
            result={finishedGameState.winner ? 'win' : finishedGameState.isDraw ? 'draw' : 'lose'}
            gameType={gameType}
            player1={{
              playerName: finishedGameState.winner ? 'Your Name' : 'Opponent Name',
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

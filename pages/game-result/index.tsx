import { useState } from 'react';
import { GameResult } from 'components/GameResult';
import styles from './gameResult.module.scss';
import {FinishedGameState} from "../../gameApi";
import {PlayerI} from "../../types/game";
const GameResultPage = () => {
  const [resultIndex, setResultIndex] = useState(0);
  const [gameType, setGameType] = useState<'tic-tac-toe' | 'checkers'>('checkers');
  const [finishGameCheckResult, setFinishGameCheckResult] = useState<null | { winner: boolean , isDraw: boolean, cheatWin: boolean} >(null);
  const [finishedGameState, setFinishedGameState] = useState<FinishedGameState | null>(null);
  const [players, setPlayers] = useState<PlayerI[]>([]);
  console.log('FINISH Page GAMERESULT finishedGameState ', finishedGameState);
  console.log('FINISH Page GAMERESULT finishGameCheckResult ', finishGameCheckResult);
  console.log('PLAYERS Page GAMERESULT', players);
  console.log('FINISH Page GAMERESULT FinishedGameState', FinishedGameState);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <GameResult finishGameCheckResult={finishGameCheckResult} finishedGameState={finishedGameState} players={players} />
      </div>
    </div>
  );
};

export default GameResultPage;

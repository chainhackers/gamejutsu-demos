import {useState} from 'react';
import {GameResult} from 'components/GameResult';
import styles from './gameResult.module.scss';
import {FinishedGameState} from "../../gameApi";
import {GameStateContextProvider, useGameStateContext} from "../../contexts/GameStateContext";

const GameResultPage = () => {
  const gameStateContext = useGameStateContext();
  const {finishResult, setFinishResult} = gameStateContext;
  console.log('FINISH Page GAMERESULT finishResult ', finishResult);

  return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <GameResult />
        </div>
      </div>
  );
};
export default GameResultPage;

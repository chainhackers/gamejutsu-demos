import {useState} from 'react';
import {GameResult} from 'components/GameResult';
import styles from './gameResult.module.scss';
import {FinishedGameState} from "../../gameApi";
import {GameStateContextProvider, useGameStateContext} from "../../contexts/GameStateContext";

const GameResultPage = () => {
  // const gameStateContext = useGameStateContext();
  // const { finishResult } = gameStateContext;
  // console.log('Данные из контекста в GameResultPage:', finishResult);

  return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <GameStateContextProvider>
          <GameResult />
          </GameStateContextProvider>
        </div>
      </div>
  );
};
export default GameResultPage;


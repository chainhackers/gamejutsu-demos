'use client';
import styles from './GameResult.module.scss';
import { GameResultProps } from './GameResultProps';


export const GameResult = (props: GameResultProps) => {
  const { result } = props;

  return (
    <div className={styles.gameResult}>
      <h1>HI PLAYER!</h1>
      {result === 'win' && <p>YOU WON!</p>}
      {result === 'lose' && <p>YOU LOSE!</p>}
      {result === 'draw' && <p>DRAWW!</p>}
    </div>
  );
};



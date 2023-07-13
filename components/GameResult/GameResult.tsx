'use client';
import styles from './GameResult.module.scss';
import { GameResultProps } from './GameResultProps';


export const GameResult = (props: GameResultProps) => {
  const { result } = props;

  return (
    <div className={styles.gameResult}>
      <h1>HI DSADASD</h1>
      {result === 'win' && <p>Вы победили!</p>}
      {result === 'lose' && <p>Вы проиграли!</p>}
      {result === 'draw' && <p>Ничья!</p>}
    </div>
  );
};



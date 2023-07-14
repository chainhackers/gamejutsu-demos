'use client';
import classNames from 'classnames';
import styles from './GameResult.module.scss';
import { GameResultProps } from './GameResultProps';
import imgWin from 'public/images/win.png'
import Image from 'next/image';
export const GameResult = (props: GameResultProps) => {
  const { result } = props;
  const resultClass = classNames(styles.container, {
    [styles.win]: result === 'win',
    [styles.lose]: result === 'lose',
    [styles.draw]: result === 'draw',
  });

  let content;
  if (result === 'win') {
    content = (
      <div className={resultClass}>
        <h2 className={styles.title}>
          <span>Winner!</span>
          <span className={styles.titleRight}>Results</span>
        </h2>
        <Image src={imgWin} alt='Win' />
        <p>Вы выиграли! Поздравляем!</p>
      </div>
    );
  } else if (result === 'lose') {
    content = (
      <div className={resultClass}>
        <p>Вы проиграли!</p>
      </div>
    );
  } else if (result === 'draw') {
    content = (
      <div className={resultClass}>
        <h1>DRAW</h1>
      </div>
    );
  }

  return <>{content}</>;
};

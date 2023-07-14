'use client';
import classNames from 'classnames';
import styles from './GameResult.module.scss';
import { GameResultProps } from './GameResultProps';
import imgWin from 'public/images/win.png';
import Image from 'next/image';
import { ScoreCard } from 'components/GameResult/ScoreCard/index';
import playerImg from 'public/logo/account-avatar.png';
import playerImg2 from 'public/logo/account-avatar2.png';
export const GameResult = (props: GameResultProps) => {
  const { result } = props;
  const resultClass = classNames(styles.container, {
    [styles.win]: result === 'win',
    [styles.lose]: result === 'lose',
    [styles.draw]: result === 'draw',
  });
  const player1 = { name: '0xh20...7260', image: playerImg };
  const player2 = { name: '0xh07...6035', image: playerImg2 };
  let content;
  if (result === 'win') {
    content = (
      <div className={resultClass}>
        <h2 className={styles.title}>
          <span>Winner!</span>
          <span className={styles.titleRight}>Results</span>
        </h2>
        <Image src={imgWin} alt='Win' />
        <ScoreCard playerName={player1.name} result={result} playerImg={player1.image} />
        <ScoreCard playerName={player2.name} result={result} playerImg={player2.image} />
        <p>Вы выиграли! Поздравляем!</p>
      </div>
    );
  } else if (result === 'lose') {
    content = (
      <div className={resultClass}>
        <h2 className={styles.title}>
          <span>Better Luck Next Time</span>
          <span className={styles.titleRight}>Results</span>
        </h2>
        <ScoreCard player={player1} result={result} />
        <ScoreCard player={player2} result={result} />
        <p>Вы проиграли!</p>
      </div>
    );
  } else if (result === 'draw') {
    content = (
      <div className={resultClass}>
        <h2 className={styles.title}>
          <span>Better Luck Next Time</span>
          <span className={styles.titleRight}>Results</span>
        </h2>
        <ScoreCard player={player1} result={result} />
        <ScoreCard player={player2} result={result} />
        <h1>DRAW</h1>
      </div>
    );
  }

  return <>{content}</>;
};

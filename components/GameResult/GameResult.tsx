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
  const player1 = {
    playerName: '0xh20...7260',
    playerImg: playerImg,
    showWinText: result === 'win',
  };
  const player2 = {
    playerName: '0xh07...6035',
    playerImg: playerImg2,
    showWinText: result === 'lose',
  };
  let content;

  if (result === 'win') {
    content = (
      <div className={resultClass}>
        <h2 className={styles.title}>
          <span>Winner!</span>
          <span className={styles.titleRight}>Results</span>
        </h2>
        <Image src={imgWin} alt='Win' />
        <div className={styles.containerCard}>
          <ScoreCard {...player1} result={result} />
          <ScoreCard {...player2} result={result} />
        </div>
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
        <ScoreCard {...player1} result={result} />
        <ScoreCard {...player2} result={result} />
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
        <ScoreCard {...player1} result={result} />
        <ScoreCard {...player2} result={result} />
        <h1>DRAW</h1>
      </div>
    );
  }

  return <>{content}</>;
};

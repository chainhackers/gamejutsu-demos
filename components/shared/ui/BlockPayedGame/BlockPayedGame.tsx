import React from 'react';
import styles from './BlockPayedGame.module.scss';
import playerLampImg from 'public/images/playerlamp.svg';
export const BlockPayedGame = () => {
  return (
    <div className={styles.container}>
      <img src={playerLampImg.src} alt='' className={styles.imageSize} />
      <p className={styles.text}>
        You just played a game for two with a guarantee of compliance with the rules, no server or contract on the blockchain was involved in the verification of moves, and it took no more than 2
        transactions from you for the whole game
      </p>
    </div>
  );
};

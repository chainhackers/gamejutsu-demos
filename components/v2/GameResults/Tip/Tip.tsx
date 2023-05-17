import React from 'react';
import styles from './Tip.module.scss';

export const Tip = () => {
  return (
    <div className={styles.card}>
      <img src='/images/lamp.svg' alt='' />
      <p>
        You just played a game for two with a guarantee of compliance with the
        rules, no server or contract on the blockchain was involved in the
        verification of moves, and it took no more than 2 transactions from you
        for the whole game
      </p>
    </div>
  );
};

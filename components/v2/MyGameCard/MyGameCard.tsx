/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { MyGameCardPropsI } from './MyGameCardProps';
import styles from './MyGameCard.module.scss';

export const MyGameCard: React.FC<MyGameCardPropsI> = ({
  id,
  stake,
  proposer,
  rules,
}) => {
  const freeImg: string = '/images/handshake.svg';
  const paidImg: string = '/images/matic.svg';
  const isConnected: boolean = false;

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.row}>
          <p className={styles.gameId}>{id}</p>

          {stake === 0 ? (
            <div className={styles.stake}>
              <div className={styles.stakeFrame}>
                <img src={freeImg} alt="handshake" />
              </div>
            </div>
          ) : (
            <div className={styles.stake}>
              <p className={styles.stakeAmount}>1</p>{' '}
              <div className={styles.stakeFrame}>
                <img src={paidImg} alt="matic" />
              </div>
            </div>
          )}
          <p className={styles.proposer}>{proposer}</p>
        </div>
        <div className={styles.row}>
          <button className={styles.btn}>Back to game</button>
          {!isConnected && (
            <div className={styles.gradientBorder}>
              <button className={styles.gradientBtn}>Cancel</button>
            </div>
          )}
        </div>
      </div>
      {isConnected ? (
        <div className={styles.status}>
          <p className={styles.statusTitle}>Connected to game!</p>
          <div className={styles.checkCircle}>
            <img src="/images/check-circle.png" alt="" />
          </div>
        </div>
      ) : (
        <div className={styles.status}>
          <p className={styles.statusTitle}>Waiting for players</p>
          <div className={styles.loader}></div>
        </div>
      )}
    </div>
  );
};

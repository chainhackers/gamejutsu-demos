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
  const statusTitle = 'Waiting for players';
  const freeImg = '/images/handshake.png';
  const paidImg = '/images/matic.png';

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.row}>
          <p className={styles.gameId}>{id}</p>

          {stake === 0 ? (
            <div className={styles.stake}>
              <div className={styles.stakeFrame}>
                <img src={freeImg} />
              </div>
            </div>
          ) : (
            <div className={styles.stake}>
              <p className={styles.qqq}>1</p>{' '}
              <div className={styles.stakeFrame}>
                <img src={paidImg} alt="" />
              </div>
            </div>
          )}
          <p className={styles.proposer}>{proposer}</p>
        </div>
        <div className={styles.row}>
          <button className={styles.btn}>Back to game</button>
          <div className={styles.gradientBorder}>
            <button className={styles.gradientBtn}>Cancel</button>
          </div>
        </div>
      </div>
      <div className={styles.status}>
        <p className={styles.statusTitle}>{statusTitle}</p>
        <div className={styles.loader}></div>
        {/* <div className={styles.statusImage}></div> */}
      </div>
    </div>
  );
};

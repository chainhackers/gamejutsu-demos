/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { JoinGameCardPropsI } from './JoinGameCardProps';
import styles from './JoinGameCard.module.scss';
import Blockies from 'react-blockies';
import { shortenAddress } from 'helpers/utils';

export const JoinGameCard: React.FC<JoinGameCardPropsI> = ({
  gameId,
  winner,
  loser,
  header,
  onClick,
  stake,
  proposer,
  rules,
  gameType,
}) => {
  const freeImg: string = '/images/handshake.svg';
  const paidImg: string = '/images/matic.svg';

  return (
    <div className={styles.card}>
      <p className={styles.gameId}>{gameId}</p>
      {stake === '0' ? (
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
      <div className={styles.row}>
        <Blockies
          className={`${styles.proposerPseudographic} rounded-full`}
          seed={proposer}
          size={5}
        />
        <p className={styles.proposer}>{shortenAddress(proposer)}</p>
      </div>
      <button
        onClick={() => onClick!(gameId, stake, gameType, proposer)}
        className={styles.gradientBtn}
      >
        Join{' '}
        <img
          src="/images/users.svg
      "
          alt="users"
        />
      </button>
    </div>
  );
};

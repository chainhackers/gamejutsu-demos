/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { MyGameCardPropsI } from './MyGameCardProps';
import styles from './MyGameCard.module.scss';
import { shortenAddress } from 'helpers/utils';
import Blockies from 'react-blockies';
import router from 'next/router';

export const MyGameCard: React.FC<MyGameCardPropsI> = ({
  gameId,
  winner,
  loser,
  header,
  stake,
  proposer,
  rules,
  gameType,
  started,
  accepter,
}) => {
  const backToGame = () => {
    router.push(`/games/${gameType}?game=${gameId}`);
  };

  const freeImg: string = '/images/handshake.svg';
  const paidImg: string = '/images/matic.svg';

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.row}>
          <p className={styles.gameId}>{gameId}</p>

          {Number(stake) === 0 ? (
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
        </div>
        <div className={styles.row}>
          <button className={styles.btn} onClick={backToGame}>
            Back to game
          </button>
          {/* //todo: add cancel game functional to contract
          https://github.com/orgs/chainhackers/projects/3?pane=issue&itemId=27807113 */}
          {/* {!started && (
            <div className={styles.gradientBorder}>
              <button className={styles.gradientBtn}>Cancel</button>
            </div>
          )} */}
        </div>
      </div>
      {started ? (
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

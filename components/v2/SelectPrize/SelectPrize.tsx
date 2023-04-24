import React, { useState } from 'react';
import styles from './SelectPrize.module.scss';
import { SelectPrizePropsI } from './SelectPrizeProps';
import gameApi, { getArbiter, getRulesContract } from 'gameApi';
import { GameProposedEventObject } from '.generated/contracts/esm/types/polygon/Arbiter';
import { useRouter } from 'next/router';
export const SelectPrize: React.FC<SelectPrizePropsI> = ({
  gameType,
  address,
  url,
  isTransactionPending,
  setIsTransactionPending,
  isRequestConfirmed,
  setIsRequestConfirmed,
}) => {
  const router = useRouter();

  const createNewGameHandler = async (isPaid: boolean = false) => {
    let proposeGameResult: GameProposedEventObject = await gameApi.proposeGame(
      await getArbiter(),
      (
        await getRulesContract(gameType)
      ).address,
      isPaid
    );
    return proposeGameResult.gameId.toNumber();
  };

  const clickHandler = async (stake: false | 'stake') => {
    setIsTransactionPending(true);
    createNewGameHandler(!!stake)
      .then((gameId) => {
        setIsTransactionPending(false);
        setIsRequestConfirmed(true);
        router.push(`/games/${gameType}?game=${gameId}`);
      })
      .catch((error) => {
        setIsTransactionPending(false);
        setIsRequestConfirmed(false);
        console.error(error);
      });
  };
  return (
    <div className={styles.chooseStake}>
      <div className={styles.gradientBorder}>
        <button
          className={styles.stakeButton}
          onClick={async (event) =>
            address ? clickHandler(false) : router.push(`/connect?game=${url}`)
          }
        >
          No stake
          <div className={styles.imageWrapper}>
            <img src="/images/handshake.png" alt="handshake" />
          </div>
        </button>
      </div>
      <div className={styles.gradientBorder}>
        <button
          className={styles.stakeButton}
          onClick={async (event) =>
            address
              ? clickHandler('stake')
              : router.push(`/connect?game=${url}`)
          }
        >
          Stake 1
          <div className={styles.imageWrapper}>
            <img src="/images/matic.png" alt="matic" />
          </div>
        </button>
      </div>
    </div>
  );
};

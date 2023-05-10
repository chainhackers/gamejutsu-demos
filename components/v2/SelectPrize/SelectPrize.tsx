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
  transactionLink,
  setTransatctionLink,
}) => {
  const router = useRouter();

  async function setModalInfo(hash: any) {
    setIsTransactionPending(false);
    setIsRequestConfirmed(true);
    const address = await hash;
    setTransatctionLink(address.hash);
  }
  const createNewGameHandler = async (isPaid: boolean = false) => {
    let proposeGameResult: GameProposedEventObject = await gameApi.proposeGame(
      await getArbiter(),
      (
        await getRulesContract(gameType)
      ).address,
      isPaid,
      setModalInfo
    );
    return proposeGameResult.gameId.toNumber();
  };

  const clickHandler = async (stake: false | 'stake') => {
    setIsTransactionPending(true);
    createNewGameHandler(!!stake)
      .then((gameId) => {
        router.push(`/games/${gameType}?game=${gameId}`);
      })
      .catch((error) => {
        setIsTransactionPending(false);
        setIsRequestConfirmed(false);
        console.error(error);
      });
  };

  const createFreeGameHandler = async () => {
    address ? clickHandler(false) : router.push(`/connect?game=${url}`);
  };

  const createPaidGameHandler = async () => {
    address ? clickHandler('stake') : router.push(`/connect?game=${url}`);
  };

  return (
    <div className={styles.chooseStake}>
      <div className={styles.gradientBorder}>
        <button className={styles.stakeButton} onClick={createFreeGameHandler}>
          No stake
          <div className={styles.imageWrapper}>
            <img src="/images/handshake.svg" alt="handshake" />
          </div>
        </button>
      </div>
      <div className={styles.gradientBorder}>
        <button className={styles.stakeButton} onClick={createPaidGameHandler}>
          Stake 1
          <div className={styles.imageWrapper}>
            <img src="/images/matic.svg" alt="matic" />
          </div>
        </button>
      </div>
    </div>
  );
};

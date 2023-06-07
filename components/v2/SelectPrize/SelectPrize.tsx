import React from 'react';
import styles from './SelectPrize.module.scss';
import { SelectPrizePropsI } from './SelectPrizeProps';
import gameApi, { getArbiter, getRulesContract } from 'gameApi';
import { GameProposedEventObject } from '.generated/contracts/esm/types/polygon/Arbiter';
import { useRouter } from 'next/router';
export const SelectPrize: React.FC<SelectPrizePropsI> = ({
  gameType,
  address,
  url,
  setIsTransactionPending,
  setIsRequestConfirmed,
  setTransactionLink,
  openWalletModal,
}) => {
  const router = useRouter();

  async function setModalInfo(hash: any) {
    setIsTransactionPending(false);
    setIsRequestConfirmed(true);
    const transactionAddress = await hash;
    setTransactionLink(transactionAddress.hash);
  }
  const createNewGameHandler = async (isPaid: boolean) => {
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

  const clickHandler = async (stake: false | true) => {
    if (!address) {
      openWalletModal();
      return;
    }
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
    clickHandler(false);
  };

  const createPaidGameHandler = async () => {
    clickHandler(true);
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

import React from 'react';
import styles from './SelectPrize.module.scss';
import { SelectPrizePropsI } from './SelectPrizeProps';
import gameApi, { getArbiter, getRulesContract } from 'gameApi';
import { GameProposedEventObject } from '.generated/contracts/esm/types/polygon/Arbiter';
import router from 'next/router';
export const SelectPrize: React.FC<SelectPrizePropsI> = ({ gameType }) => {
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

  const clickHandler =
    async (stake = undefined || 'stake') =>
    () => {
      console.log(1);

      createNewGameHandler(!!stake)
        .then((gameId) => {
          router.push(`/games/${router.query.gameType}?game=${gameId}`);
        })
        .catch((error) => {
          console.error(error);
        });
    };
  return (
    <div className={styles.chooseStake}>
      <div className={styles.gradientBorder}>
        <button className={styles.stakeButton} onClick={clickHandler()}>
          No stake
        </button>
      </div>
      <div className={styles.gradientBorder}>
        <button
          className={styles.stakeButton}
          onClick={(e: any) => clickHandler('stake')}
        >
          Stake 1
        </button>
      </div>
    </div>
  );
};

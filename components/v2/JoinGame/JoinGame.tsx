import React, { useEffect, useState } from 'react';
import { JoinGamePropsI } from './JoinGameProps';
import styles from './JoinGame.module.scss';
import { TGameType } from 'types/game';
import { GameInfo } from '../GameInfo';
import { JoinGameList } from './JoinGameList/JoinGameList';
import router from 'next/router';
import { useAccount } from 'wagmi';
import { BigNumber } from 'ethers';
import gameApi, { getArbiter } from 'gameApi';

export const JoinGame: React.FC<JoinGamePropsI> = ({ games }) => {
  const account = useAccount();

  const acceptGameHandler = async (
    acceptedGameId: number,
    stake: string
  ): Promise<void> => {
    if (!account) {
      throw new Error(`JoinGame: no wallet`);
    }
    if (!acceptedGameId) {
      throw new Error(`JoinGame: no game id`);
    }
    const acceptGameResult = await gameApi.acceptGame(
      await getArbiter(),
      BigNumber.from(acceptedGameId),
      stake
    );
  };

  const clickHandler = async (gameId: string, stake: string) => {
    acceptGameHandler(parseInt(gameId), stake)
      .then(() => {
        router.push(`/games/${router.query.gameType}?game=${gameId}`);
      })
      .catch((error) => {
        console.error('Accepting game failed', error);
      });
  };

  return (
    <div>
      {games?.map((gameInfo) => {
        const gameType = gameInfo.url as TGameType;
        return (
          <div key={gameInfo.name}>
            <GameInfo {...gameInfo} />
            <div className={styles.gameListInfo}>
              <p>Id</p>
              <p>Stake</p>
              <p>Proposer</p>
            </div>
            <JoinGameList onClick={clickHandler} gameType={gameType} />
          </div>
        );
      })}
    </div>
  );
};

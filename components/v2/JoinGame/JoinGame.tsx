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
import { Modal } from '../Modal';

export const JoinGame: React.FC<JoinGamePropsI> = ({ games }) => {
  const account = useAccount();

  const [isTransactionPending, setIsTransactionPending] =
    useState<boolean>(false);
  const [isRequestConfirmed, setIsRequestConfirmed] = useState<boolean>(false);
  const [transactionLink, setTransactionLink] = useState<string>('');

  async function setModalInfo(hash: any) {
    setIsTransactionPending(false);
    setIsRequestConfirmed(true);
    const address = await hash;
    setTransactionLink(address.hash);
  }

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
      stake,
      setModalInfo
    );
  };

  const clickHandler = async (
    gameId: string,
    stake: string,
    gameType: string,
    proposer: string
  ) => {
    if (account.address!.toLowerCase() === proposer) {
      router.push(`/games/${gameType}?game=${gameId}`);
      return;
    }
    setIsTransactionPending(true);
    acceptGameHandler(parseInt(gameId), stake)
      .then(() => {
        router.push(`/games/${gameType}?game=${gameId}`);
      })
      .catch((error) => {
        setIsTransactionPending(false);
        setIsRequestConfirmed(false);
        console.error('Accepting game failed', error);
      });
  };

  return (
    <div>
      {isTransactionPending && (
        <Modal>
          <div className={styles.modal}>
            <h4 className={styles.modalTitle}>Pending Transaction</h4>
            <p className={styles.modalSubtitle}>Game Creation</p>
            <div className={styles.padding}></div>
            <p className={styles.modalDescription}>
              Confirm the request that's just appeared. If you can't see a
              request, open your wallet extension.
            </p>
          </div>
        </Modal>
      )}
      {isRequestConfirmed && (
        <Modal>
          <div className={styles.modal}>
            <h4 className={styles.modalTitle}>Pending Transaction</h4>
            <p className={styles.modalSubtitle}>Game Creation</p>
            <div className={styles.loader}></div>
            <a
              href={`https://polygonscan.com/tx/${transactionLink}`}
              target="_blank"
              className={styles.modalDescriptionGradient}
            >
              See in blockchain explorer
            </a>
          </div>
        </Modal>
      )}
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
            <JoinGameList
              onClick={clickHandler}
              gameType={gameType}
              // setIsTransactionPending={setIsTransactionPending}
              // setIsRequestConfirmed={setIsRequestConfirmed}
              // setTransactionLink={setTransactionLink}
            />
          </div>
        );
      })}
    </div>
  );
};

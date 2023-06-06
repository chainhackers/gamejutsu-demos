import React, { useState } from 'react';
import styles from './Join.module.scss';
import { GameInfo } from 'components/v2/GameInfo';
import { JoinGameList } from 'components/v2/JoinGameList';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { BigNumber } from 'ethers';
import gameApi, { getArbiter } from 'gameApi';
import { Modal } from 'components/v2/Modal';
import modalStyles from 'components/v2/Modal/Modal.module.scss';
import { NextPage } from 'next';
import games from 'data/games.json';
import { Tabs } from 'components/v2/Tabs';
import { useTranslation } from 'react-i18next';
import { WalletModal } from 'components/v2/WalletModal';

const JoinGame: NextPage = () => {
  const router = useRouter();
  const { gameType } = router.query;
  const account = useAccount();
  const { t } = useTranslation();

  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const openWalletModal = () => {
    setShowWalletModal(true);
  };
  const closeWalletModal = () => {
    setShowWalletModal(false);
  };

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
    if (!account.address) {
      openWalletModal();
      return;
    }
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
    <div className={styles.container}>
      <h3 className={styles.title}>{t('gamesPage.joinGame.title')}</h3>
      <div className={styles.description}>
        {t('gamesPage.joinGame.description')}
      </div>
      <Tabs />
      {showWalletModal && <WalletModal closeModal={closeWalletModal} />}
      {isTransactionPending && (
        <Modal isClosable={false}>
          <div className={modalStyles.modal}>
            <h4 className={modalStyles.modalTitle}>Pending Transaction</h4>
            <p className={modalStyles.modalSubtitle}>Game Creation</p>
            <div className={modalStyles.padding}></div>
            <p className={modalStyles.modalDescription}>
              Confirm the request that's just appeared. If you can't see a
              request, open your wallet extension.
            </p>
          </div>
        </Modal>
      )}
      {isRequestConfirmed && (
        <Modal isClosable={false}>
          <div className={modalStyles.modal}>
            <h4 className={modalStyles.modalTitle}>Pending Transaction</h4>
            <p className={modalStyles.modalSubtitle}>Game Creation</p>
            <div className={modalStyles.loader}></div>
            <a
              href={`https://polygonscan.com/tx/${transactionLink}`}
              target="_blank"
              className={modalStyles.modalDescriptionGradient}
            >
              See in blockchain explorer
            </a>
          </div>
        </Modal>
      )}
      {games?.map((gameInfo) => {
        if (gameInfo.url === gameType) {
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
        }
      })}
    </div>
  );
};

export default JoinGame;

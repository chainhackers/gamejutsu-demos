import { GameThumbnail } from 'components/v2/GameThumbnail';
import styles from './Games.module.scss';
import { useState } from 'react';
import { Modal } from 'components/v2/Modal';
import modalStyles from 'components/v2/Modal/Modal.module.scss';
import { NextPage } from 'next';
import games from 'data/games.json';
import { Tabs } from 'components/v2/Tabs';
import { useTranslation } from 'react-i18next';
import { WalletModal } from 'components/v2/WalletModal';

const GameDemo: NextPage = () => {
  const { t } = useTranslation();

  const [isTransactionPending, setIsTransactionPending] =
    useState<boolean>(false);
  const [isRequestConfirmed, setIsRequestConfirmed] = useState<boolean>(false);
  const [transactionLink, setTransactionLink] = useState<string>('');

  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const openWalletModal = () => {
    setShowWalletModal(true);
  };
  const closeWalletModal = () => {
    setShowWalletModal(false);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('gamesPage.gameDemo.title')}</h3>
      <div className={styles.description}>
        {t('gamesPage.gameDemo.description')}
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

      <div className={styles.gamelist}>
        {games &&
          games.map((game, index) => {
            return (
              <GameThumbnail
                key={game.name + index}
                {...game}
                name={game.name}
                url={game.url}
                description={game.description}
                setIsTransactionPending={setIsTransactionPending}
                setIsRequestConfirmed={setIsRequestConfirmed}
                setTransactionLink={setTransactionLink}
                openWalletModal={openWalletModal}
              />
            );
          })}
      </div>
    </div>
  );
};

export default GameDemo;

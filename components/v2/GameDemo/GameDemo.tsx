import { useTranslation } from 'react-i18next';
import { GameThumbnail } from 'components/v2/GameThumbnail';
import styles from './GameDemo.module.scss';
import { GameDemoPropsI } from './GameDemoProps';
import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import Link from 'next/link';

export const GameDemo: React.FC<GameDemoPropsI> = ({ games }) => {
  const [isTransactionPending, setIsTransactionPending] =
    useState<boolean>(false);
  const [isRequestConfirmed, setIsRequestConfirmed] = useState<boolean>(false);
  const [transactionLink, setTransactionLink] = useState<string>('');
  return (
    <div className={styles.container}>
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
                isTransactionPending={isTransactionPending}
                setIsTransactionPending={setIsTransactionPending}
                isRequestConfirmed={isRequestConfirmed}
                setIsRequestConfirmed={setIsRequestConfirmed}
                transactionLink={transactionLink}
                setTransactionLink={setTransactionLink}
              />
            );
          })}
      </div>
    </div>
  );
};

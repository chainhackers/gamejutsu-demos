/* eslint-disable @next/next/no-img-element */
import { GameThumbnailPropsI } from './GameThumbnailProps';

import styles from './GameThumbnail.module.scss';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { getRulesContract } from 'gameApi';
import { TGameType } from 'types/game';
import { useTranslation } from 'react-i18next';
import { SelectPrize } from '../SelectPrize';
import Blockies from 'react-blockies';
import { shortenAddress } from 'helpers/utils';
import Link from 'next/link';

export const GameThumbnail: React.FC<GameThumbnailPropsI> = ({
  name,
  image,
  url,
  description,
  setIsTransactionPending,
  setIsRequestConfirmed,
  setTransactionLink,
  openWalletModal,
}) => {
  const { t } = useTranslation();
  const [rulesAddress, setRulesAddress] = useState('');
  const [isStartButtonOpen, setIsStartButtonOpen] = useState(false);

  const gameName = t(`gameTypePage.games.${name}`);
  const gameType = url as TGameType;
  const { address } = useAccount();

  function toggleStartButton() {
    setIsStartButtonOpen(!isStartButtonOpen);
  }

  useEffect(() => {
    getRulesContract(gameType).then((response) => {
      setRulesAddress(response.address);
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.image}>
          <img src={image} alt="game icon" />
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.name}>{gameName}</div>
          <div className={styles.rulesAddress}>
            <Blockies
              seed={!!rulesAddress ? rulesAddress : '0x00000000000'}
              size={5}
              className="rounded-full"
            />
            <div className={styles.address}>{shortenAddress(rulesAddress)}</div>
          </div>
          <div className={styles.description}>{description}</div>
        </div>
      </div>
      <div className={styles.buttons}>
        <Link href={`/v2/join?game=${gameType}`}>
          <button>
            Join{' '}
            <div className={styles.users}>
              <img src="/images/users.svg" alt="" />
            </div>
          </button>
        </Link>

        <button onClick={toggleStartButton}>
          Start new game
          <div
            className={
              styles.play + ' ' + (isStartButtonOpen ? styles.active : '')
            }
          >
            <img src="/images/play.svg" alt="" />
          </div>
        </button>
      </div>
      {isStartButtonOpen && (
        <SelectPrize
          gameType={gameType}
          address={!!address}
          url={url}
          setIsTransactionPending={setIsTransactionPending}
          setIsRequestConfirmed={setIsRequestConfirmed}
          setTransactionLink={setTransactionLink}
          openWalletModal={openWalletModal}
        />
      )}
    </div>
  );
};

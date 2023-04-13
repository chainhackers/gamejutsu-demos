import { GameThumbnailPropsI } from './GameThumbnailProps';
import Image from 'next/image';
import styles from './GameThumbnail.module.scss';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { getRulesContract } from 'gameApi';
import { TGameType } from 'types/game';
import { useTranslation } from 'react-i18next';
import { SelectPrize } from '../SelectPrize';

export const GameThumbnail: React.FC<GameThumbnailPropsI> = ({
  name,
  image,
  url,
  description,
}) => {
  const { t } = useTranslation();
  const [rulesAddress, setRulesAddress] = useState('');
  const [isStartButtonOpen, setIsStartButtonOpen] = useState(false);

  const gameName = t(`gameTypePage.games.${name}`);
  const game = url as TGameType;
  const { address } = useAccount();

  function shortenAddress(str: string) {
    return str.slice(0, 5) + '...' + str.slice(-4);
  }

  useEffect(() => {
    getRulesContract(game).then((response) => {
      setRulesAddress(shortenAddress(response.address));
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.image}>
          <Image src={image} layout="fill" />
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.name}>{gameName}</div>
          <div className={styles.address}>{rulesAddress}</div>
          <div className={styles.description}>{description}</div>
        </div>
      </div>
      <div className={styles.buttons}>
        <Link
          href={
            address ? '/games/' + url + '?join=true' : `/connect?game=${url}`
          }
        >
          <button>
            Join <div className={styles.users}></div>
          </button>
        </Link>
        {/* <Link href={address ? '/games/' + url + '?prize=true' : `/connect?game=${url}`}>
      </Link> */}
        <button onClick={() => setIsStartButtonOpen(!isStartButtonOpen)}>
          Start new game
          <div
            className={
              styles.play + ' ' + (isStartButtonOpen ? styles.active : '')
            }
          ></div>
        </button>
      </div>
      {isStartButtonOpen && <SelectPrize gameType={game} />}
    </div>
  );
};

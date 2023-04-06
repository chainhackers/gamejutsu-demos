import { GameThumbnailPropsI } from './GameThumbnailProps';
import Image from 'next/image';
import styles from './GameThumbnail.module.scss';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { use } from 'i18next';
export const GameThumbnail: React.FC<GameThumbnailPropsI> = ({ name, image, url, description }) => {
  const { address } = useAccount();
  const [startButtonState, setStartButtonState] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.image}>
            <Image src={image} layout="fill" />
        </div>
        <div className={styles.cardInfo}>
        <div className={styles.name}>{name}</div>
        <div className={styles.description}>{description}</div>
        </div>
      </div>
      <div className={styles.buttons}>
      <Link href={address ? '/games/' + url +'?join=true' : `/connect?game=${url}`}>
        <button>Join <div className={styles.users}></div></button>
      </Link>
      {/* <Link href={address ? '/games/' + url + '?prize=true' : `/connect?game=${url}`}>
      </Link> */}
        <button>Start new game <div className={styles.play}></div> </button>
      </div>
    </div>
  );
};
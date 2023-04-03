import { GameThumbnailPropsI } from './GameThumbnailProps';
import Image from 'next/image';
import styles from './GameThumbnail.module.scss';
import Link from 'next/link';
export const GameThumbnail: React.FC<GameThumbnailPropsI> = ({ name, image, url, description }) => {
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
      {/* <Link href={url}>
        <a>
          
          
        </a>
      </Link> */}
      <div className={styles.buttons}>
        <button>Join <div className={styles.users}></div></button>
        <button>Start new game <div className={styles.play}></div></button>
      </div>
    </div>
  );
};

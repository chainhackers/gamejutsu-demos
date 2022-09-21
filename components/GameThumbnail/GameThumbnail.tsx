
import { GameThumbnailPropsI } from './GameThumbnailProps';
import styles from './GameThumbnail.module.scss';
import Link from 'next/link';
export const GameThumbnail: React.FC<GameThumbnailPropsI> = ({ name, image, url }) => {
  return (
    <div className={styles.container}>
      <Link href={url}>
        <a>
          <div className={styles.image}>image</div>
          <div className={styles.name}>{name}</div>
        </a>
      </Link>
    </div>
  );
};

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import empty_avatar from 'public/images/empty_avatar.png';
import { SelectGamePropsI } from './SelectGameProps';
import styles from './SelectGame.module.scss';
export const SelectGame: React.FC<SelectGamePropsI> = ({ userName, gameType }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.title}>{t('selectGame.title')}</div>
      <div className={styles.description}>{t('selectGame.description')}</div>
      <div className={styles.avatar}>
        <Image src={empty_avatar} alt={'avatat'} width="61px" height="61px"></Image>
      </div>
      <div className={styles.userName}>
        {userName ? userName : t('selectGame.unknownUser')}
      </div>
      <div className={styles.selection}>
        <div className={styles.new}>
          <div className={styles.title}>{t('selectGame.new.title')}</div>
          <div className={styles.description}>{t('selectGame.new.description')}</div>
          <Link href={'/games/' + gameType}>
            <a>
              <div className={styles.button}>{t('selectGame.new.button')}</div>
            </a>
          </Link>
        </div>
        <div className={styles.join}>
          <div className={styles.title}>{t('selectGame.join.title')}</div>
          <div className={styles.description}>{t('selectGame.join.description')}</div>
          <Link href={'/games/' + gameType + '?join=true'}>
            <a>
              <div className={styles.button}>{t('selectGame.join.button')}</div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

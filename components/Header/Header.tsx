import { useTranslation } from 'react-i18next';
import { Logo, Navigation, Button } from 'components';
import { HeaderPropsI } from './HeaderProps';
import styles from './Header.module.scss';
import Link from 'next/link';
export const Header: React.FC<HeaderPropsI> = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
        <Link href="/">
          <a>
            <div className={styles.title}>{t('header.title')}</div>
          </a>
        </Link>
      </div>
      <div className={styles.right}>
        <Navigation />
        <Button title={t('buttons.connectWAllet')} onClick={() => console.log('dfs')} />
      </div>
    </div>
  );
};

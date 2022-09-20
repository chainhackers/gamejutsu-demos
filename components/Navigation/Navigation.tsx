import { useTranslation } from 'react-i18next';
import { NavigationPropsI } from './NavigationProps';
import styles from './Navigation.module.scss';
import Link from 'next/link';
export const Navigation: React.FC<NavigationPropsI> = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <nav className={styles.navigation}>
        <ul>
          <li>
            <Link href="/games">{t('navigation.gameDemo')}</Link>
          </li>
          <li>
            <a href="https://github.com/chainHackers" target="_blank">
              {t('navigation.gitHub')}
            </a>
          </li>
          <li>
            <a href="https://github.com/chainHackers" target="_blank">
              {t('navigation.team')}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

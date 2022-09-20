import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { NavigationPropsI } from './NavigationProps';
import styles from './Navigation.module.scss';
import Link from 'next/link';
export const Navigation: React.FC<NavigationPropsI> = ({ active }) => {
  const { t } = useTranslation();
  console.log('active', active);
  return (
    <div className={styles.container}>
      <nav className={styles.navigation}>
        <ul>
          <li className={cn(active && (active === 'games' ? styles.active : styles.inactive))}>
            <Link href="/games">{t('navigation.gameDemo')}</Link>
          </li>
          <li
            className={cn(active && (active === 'github' ? styles.active : styles.inactive))}
          >
            <a href="https://github.com/chainHackers" target="_blank">
              {t('navigation.gitHub')}
            </a>
          </li>
          <li className={cn(active && (active === 'team' ? styles.active : styles.inactive))}>
            <a href="https://github.com/chainHackers" target="_blank">
              {t('navigation.team')}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

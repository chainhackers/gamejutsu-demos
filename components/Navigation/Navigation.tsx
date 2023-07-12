import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { NavigationPropsI } from './NavigationProps';
import styles from './Navigation.module.scss';
import Link from 'next/link';
import { useState } from 'react';
export const Navigation: React.FC<NavigationPropsI> = ({ active }) => {
  const { t } = useTranslation();

  const [isBurgerActive, toggleBurgerMenu] = useState(false);

  return (
    <div className={styles.container}>
      <nav>
        <ul className={styles.nav}>
          <li className={cn(active && (active === 'team' ? styles.active : styles.inactive))}>
            <Link href='/team'>{t('navigation.team')}</Link>
          </li>
          <li className={cn(active && (active === 'git' ? styles.active : styles.inactive))}>
            <a
              href='https://github.com/ChainHackers/GameJutsu#readme'
              target='_blank'>
              {t('navigation.gitHub')}
            </a>
          </li>
          <li className={cn(active && (active === 'discord' ? styles.active : styles.inactive))}>
            <a
              href='https://discord.gg/a5E9vWbp9R'
              target='_blank'>
              {t('navigation.discord')}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

import React from 'react';
import { TabsPropsI } from './TabsProps';
import styles from './Tabs.module.scss';
import { useRouter } from 'next/router';
import Link from 'next/link';
import classNames from 'classnames';

export const Tabs: React.FC<TabsPropsI> = () => {
  const cn = classNames;
  const router = useRouter();
  const { pathname } = router;
  const { gameType } = router.query;
  const pathArray: string[] = pathname.split('/');

  return (
    <div className={styles.tabs}>
      <ul>
        {gameType ? (
          <li className={cn(pathArray.includes('join') ? styles.active : null)}>
            Join game
          </li>
        ) : (
          <Link href="/v2/games">
            <li
              className={cn(pathArray.includes('games') ? styles.active : null)}
            >
              Game demo
            </li>
          </Link>
        )}
        <Link href="/v2/my-games">
          <li
            className={cn(
              pathArray.includes('my-games') ? styles.active : null
            )}
          >
            My games
          </li>
        </Link>
      </ul>
    </div>
  );
};

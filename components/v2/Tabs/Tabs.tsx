import React from 'react';
import { TabsPropsI } from './TabsProps';
import styles from './Tabs.module.scss';
import { useRouter } from 'next/router';

export const Tabs: React.FC<TabsPropsI> = () => {
  const router = useRouter();
  const { pathname } = router;
  const pathArray = pathname.split('/');
  const lastPathValue = pathArray[pathArray.length - 1];
  console.log(lastPathValue);

  const gameDemoRedirect = () => {
    router.push('/v2/games');
  };
  const joinGameRedirect = () => {
    router.push('/v2/join');
  };
  const myGamesRedirect = () => {
    router.push('/v2/mygames');
  };

  return (
    <div className={styles.tabs}>
      <ul>
        <li onClick={gameDemoRedirect}>Game demo</li>
        <li onClick={joinGameRedirect}>Join game</li>
        <li onClick={myGamesRedirect}>My games</li>
      </ul>
    </div>
  );
};

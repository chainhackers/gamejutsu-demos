import React from 'react';
// import { MyGamesPropsI } from './MyGamesProps';
import styles from './MyGames.module.scss';
import { GameInfo } from 'components/v2/GameInfo';
import { MyGamesList } from 'components/v2/MyGamesList';
import { TGameType } from 'types/game';
import { NextPage } from 'next';
import games from 'data/games.json';
import { Tabs } from 'components/v2/Tabs';
import { useTranslation } from 'react-i18next';

const MyGames: NextPage = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('gamesPage.myGames.title')}</h3>
      <div className={styles.description}>
        {t('gamesPage.myGames.description')}
      </div>
      <Tabs />
      {games?.map((gameInfo) => {
        const gameType = gameInfo.url as TGameType;
        return (
          <div key={gameInfo.name}>
            <GameInfo {...gameInfo} />
            <MyGamesList gameType={gameType} />
          </div>
        );
      })}
    </div>
  );
};

export default MyGames;

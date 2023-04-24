import { Tabs } from 'components/v2/Tabs';
import { GameDemo } from 'components/v2/GameDemo/GameDemo';
import { MyGames } from 'components/v2/MyGames';
import styles from './games.module.scss';
import games from 'data/games.json';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const GamesPage = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<string>('Game demo');

  const tabsList = ['Game demo', 'Join game', 'My games'];
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('gameTypePage.title')}</h3>
      <div className={styles.description}>{t('gameTypePage.description')}</div>
      <Tabs
        tabsList={tabsList}
        selectedTab={selectedTab}
        onClick={setSelectedTab}
      />
      {selectedTab === 'Game demo' && <GameDemo games={games} />}
      {selectedTab === 'My games' && <MyGames games={games} />}
      <div className={styles.description}>
        To start or join the game, you will need to make a transaction
      </div>
    </div>
  );
};

export default GamesPage;

import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { GameThumbnail } from 'components/v2/GameThumbnail';
import { GameDemo } from 'components/v2/GameDemo/GameDemo';
import { Tabs } from 'components/v2/Tabs';

import styles from './games.module.scss';

import games from 'data/games.json';

const GamesPage = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <Tabs />
      <GameDemo games={games} />
      <div className={styles.description}>
        To start or join the game, you will need to make a transaction
      </div>
    </div>
  );
};

export default GamesPage;

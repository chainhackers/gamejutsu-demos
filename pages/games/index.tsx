import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { GameThumbnail } from 'components';
import { useAccount } from 'wagmi';

import styles from 'pages/games/games.module.scss';

import games from 'data/games.json';

interface IGamesPageProps {
  games: { name: string; image: string; url: string; description: string }[];
}

const GamesPage: NextPage<IGamesPageProps> = ({ games }) => {
  const { t } = useTranslation();
  const { address } = useAccount();
  return (
    <div className={styles.container}>
      <div className={styles.title}>{t('gameTypePage.title')}</div>
      <div className={styles.description}>{t('gameTypePage.description')}</div>

      <div className={styles.gamelist}>
        {games &&
          games.map((game, index) => {
            return (
              <GameThumbnail
                key={game.name + index}
                {...game}
                name={t(`gameTypePage.games.${game.name}`)}
                url={address ? `/games/${game.url}?select=true` : `/connect?game=${game.url}`}
                description={game.description}
              />
            );
          })}
      </div>
      <div className={styles.description}>To start or join the game, you will need to make a transaction</div>
    </div>
  );
};

export default GamesPage;

export const getStaticProps: GetStaticProps<IGamesPageProps> = () => {
  return {
    props: {
      games: games,
    },
  };
};

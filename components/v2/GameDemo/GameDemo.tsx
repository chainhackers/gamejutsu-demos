import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { GameThumbnail } from 'components/v2/GameThumbnail';
import styles from 'pages/v2/games/games.module.scss';
import { GameDemoPropsI } from './GameDemoProps';
// import { useAccount } from 'wagmi';

// interface IGamesPageProps {
//   games: { name: string; image: string; url: string; description: string }[];
// }

export const GameDemo: React.FC<GameDemoPropsI> = ({ games }) => {
  const { t } = useTranslation();
  // const { address } = useAccount();
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
                url={game.url}
                description={game.description}
              />
            );
          })}
      </div>
    </div>
  );
};

// export default GameDemo;

// export const getStaticProps: GetStaticProps<IGamesPageProps> = () => {
//   return {
//     props: {
//       games: games,
//     },
//   };
// };
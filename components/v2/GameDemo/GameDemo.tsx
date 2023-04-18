import { useTranslation } from 'react-i18next';
import { GameThumbnail } from 'components/v2/GameThumbnail';
import styles from 'pages/v2/games/games.module.scss';
import { GameDemoPropsI } from './GameDemoProps';

export const GameDemo: React.FC<GameDemoPropsI> = ({ games }) => {
  const { t } = useTranslation();
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
                name={game.name}
                url={game.url}
                description={game.description}
              />
            );
          })}
      </div>
    </div>
  );
};

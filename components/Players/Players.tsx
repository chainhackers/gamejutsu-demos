import { useTranslation } from 'react-i18next';
import { Player } from 'components';
import { PlayersPropsI } from './PlayersProps';
import styles from './Players.module.scss';

export const Players: React.FC<PlayersPropsI> = ({ player1, player2 }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.title}>{t('players.title')}</div>
      <div>
        <Player {...player1} />
        <Player {...player2} />
      </div>
    </div>
  );
};

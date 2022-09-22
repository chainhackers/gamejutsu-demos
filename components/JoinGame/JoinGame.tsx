import { useTranslation } from 'react-i18next';
import { ActualGamesList } from 'components';
import { useQuery } from '@apollo/client';
import { gameEntitiesQuery, inRowCounterEntitiesQuery } from 'queries';
import { JoinGamePropsI } from './JoinGameProps';
import styles from './JoinGame.module.scss';
import { useRouter } from 'next/router';
export const JoinGame: React.FC<JoinGamePropsI> = () => {
  const { data, error, loading } = useQuery(gameEntitiesQuery);
  const { t } = useTranslation();
  const router = useRouter();

  const clickHandler = (gameId: string) => {
    router.push(`/games/${router.query.gameType}?gameId=${gameId}&prize=true`);
  };
  return (
    <div className={styles.container}>
      <div className={styles.title}>{t('joinGame.title')}</div>
      <div className={styles.description}>{t('joinGame.description')}</div>
      {loading && <div className={styles.loading}>Loading games list...</div>}
      {error && <div className={styles.error}>Games list loading failes</div>}
      {data && data.gameEntities && (
        <ActualGamesList gamesList={data.gameEntities} onClick={clickHandler} />
      )}
    </div>
  );
};

import { useTranslation } from 'react-i18next';
import { ActualGamesList } from 'components';
import { useQuery } from '@apollo/client';
import { gameEntitiesQuery, inRowCounterEntitiesQuery } from 'queries';
import { JoinGamePropsI } from './JoinGameProps';
import styles from './JoinGame.module.scss';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
export const JoinGame: React.FC<JoinGamePropsI> = ({ acceptGameHandler }) => {
  const { data, error, loading } = useQuery(gameEntitiesQuery);
  const { t } = useTranslation();
  const router = useRouter();
  const [isAccepting, setAccepting] = useState<boolean>(false);
  const [acceptingError, setAcceptingError] = useState<string | null>(null);
  // console.log('Graph fetched data', data);
  const gamesRulesMap: { [id: string]: string } = {
    '0xc6f81d6610a0b1bcb8cc11d50602d490b7624a96': 'tic-tac-toe',
    '0x6ede6f6f1aca5e7a3bdc403ea0ca9889e2095486': 'checkers',
  };

  const gameEntities = data?.gameEntities as { started: boolean | null; rules: string }[];

  // console.log('gameEntities', gameEntities);
  const dataToShow = !!gameEntities
    ? gameEntities.filter(
        (entity) =>
          entity.started === null &&
          gamesRulesMap[entity.rules.toLowerCase()] === router.query.gameType,
      )
    : [];
  // console.log('adfasfads', dataToShow);
  // console.log(router.query.gameType);

  const clickHandler = async (gameId: string, stake: string) => {
    // router.push(`/games/${router.query.gameType}?acceptGameId=${gameId}&prize=true`);
    setAcceptingError(null);
    setAccepting(true);
    acceptGameHandler(gameId, stake)
      .then(() => {
        router.push(`/games/${router.query.gameType}`);
      })
      .catch((error) => {
        setAcceptingError(t('joinGame.error'));
        console.error('Accepting game failed', error);
      })
      .finally(() => {
        setAccepting(false);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{t('joinGame.title')}</div>
      {!acceptingError && isAccepting && (
        <div className={styles.accepting}>{t('joinGame.accepting')}</div>
      )}
      {!acceptingError && !isAccepting && (
        <div className={styles.description}>{t('joinGame.description')}</div>
      )}
      {acceptingError && <div className={styles.error}>{t('joinGame.error')}</div>}
      {loading && <div className={styles.loading}>Loading games list...</div>}
      {error && <div className={styles.error}>Games list loading failes</div>}
      {data && data.gameEntities && (
        <ActualGamesList gamesList={dataToShow} onClick={clickHandler} />
      )}
    </div>
  );
};

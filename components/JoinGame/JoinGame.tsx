import { useTranslation } from 'react-i18next';
import { ActualGamesList } from 'components';
import { useQuery } from '@apollo/client';
import { gameEntitiesQuery } from 'queries';
import { JoinGamePropsI } from './JoinGameProps';
import styles from './JoinGame.module.scss';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getRulesContract } from '../../gameApi';
import { TGameType } from 'types/game';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const JoinGame: React.FC<JoinGamePropsI> = ({ acceptGameHandler }) => {
  const [rulesContractAddress, setRulesContractAddress] = useState<string>(ZERO_ADDRESS);
  const { t } = useTranslation();
  const router = useRouter();

  const gameType = router.query.gameType as TGameType;

  const { data, error, loading } = useQuery(gameEntitiesQuery, {
    variables: { rules: rulesContractAddress }, // getRulesContract
  });

  const [isAccepting, setAccepting] = useState<boolean>(false);
  const [acceptingError, setAcceptingError] = useState<string | null>(null);

  const gameEntities = data?.gameEntities as { started: boolean | null; rules: string }[];

  const dataToShow = !!gameEntities ? gameEntities : [];

  const clickHandler = async (gameId: string, stake: string) => {
    setAcceptingError(null);
    setAccepting(true);
    acceptGameHandler(parseInt(gameId), stake)
      .then(() => {
        router.push(`/games/${router.query.gameType}?game=${gameId}`);
      })
      .catch((error) => {
        setAcceptingError(t('joinGame.error'));
        console.error('Accepting game failed', error);
      })
      .finally(() => {
        setAccepting(false);
      });
  };

  useEffect(() => {
    getRulesContract(gameType).then((contract) => setRulesContractAddress(contract.address));
  });

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

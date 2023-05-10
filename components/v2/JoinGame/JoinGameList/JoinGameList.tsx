import React, { useEffect, useState } from 'react';
import { JoinGameListPropsI } from './JoinGameListProps';
import styles from './JoinGameList.module.scss';
import { getRulesContract } from 'gameApi';
import { JoinGameCard } from '../JoinGameCard';
import { gameEntitiesQuery } from 'queries';
import { useQuery } from '@apollo/client';
import { ZERO_ADDRESS } from 'types/constants';

export const JoinGameList: React.FC<JoinGameListPropsI> = ({
  gameType,
  onClick,
}) => {
  const [rulesContractAddress, setRulesContractAddress] =
    useState<string>(ZERO_ADDRESS);
  const { data, error, loading } = useQuery(gameEntitiesQuery, {
    variables: { rules: rulesContractAddress },
  });
  const gameEntities = data?.gameEntities as {
    started: boolean | null;
    rules: string;
  }[];

  const dataToShow = !!gameEntities ? gameEntities : [];
  useEffect(() => {
    getRulesContract(gameType).then((response) => {
      setRulesContractAddress(response.address);
    });
  }, [gameType]);

  return (
    <div>
      {loading && <div>loading</div>}
      {error && <div>error</div>}
      {dataToShow.length > 0 ? (
        dataToShow
          .slice()
          .sort((a: any, b: any) => b.gameId - a.gameId)
          .map((game: any) => (
            <JoinGameCard
              key={game.gameId}
              {...game}
              onClick={onClick}
              gameType={gameType}
            />
          ))
      ) : (
        <p className={styles.noGames}>No games to join</p>
      )}
    </div>
  );
};

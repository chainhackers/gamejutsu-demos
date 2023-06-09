import React from 'react';
import { JoinGameListPropsI } from './JoinGameListProps';
import styles from './JoinGameList.module.scss';
import { JoinGameCard } from '../JoinGameCard';
import { gameEntitiesQuery } from 'queries';
import { useQuery } from '@apollo/client';

export const JoinGameList: React.FC<JoinGameListPropsI> = ({
  gameType,
  onClick,
  rulesContractAddress,
}) => {
  const { data, error, loading } = useQuery(gameEntitiesQuery, {
    variables: { rules: rulesContractAddress },
  });
  const gameEntities = data?.gameEntities as {
    started: boolean | null;
    rules: string;
  }[];

  const dataToShow = !!gameEntities ? gameEntities : [];
  return (
    <div>
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

import React from 'react';
import { MyGamesListPropsI } from './MyGamesListProps';
import styles from './MyGamesList.module.scss';
import { MyGameCard } from '../MyGameCard';
import { useQuery } from '@apollo/client';
import { gameEntitiesQuery } from 'queries';
import { useAccount } from 'wagmi';

export const MyGamesList: React.FC<MyGamesListPropsI> = ({
  rulesContractAddress,
  gameType,
}) => {
  const account = useAccount();

  const { data, error, loading } = useQuery(gameEntitiesQuery, {
    variables: { rules: rulesContractAddress },
  });

  const gameEntities = data?.gameEntities as {
    started: boolean | null;
    rules: string;
  }[];

  const dataToShow = !!gameEntities ? gameEntities : [];

  const filteredGames = dataToShow.filter((game: any) => {
    if (account.address) {
      return (
        game.proposer === account.address!.toLowerCase() ||
        game.accepter === account.address!.toLowerCase()
      );
    }
  });

  if (!account.address) {
    return <p className={styles.noGames}>You have no games in this section</p>;
  }

  return (
    <div className={styles.gamesList}>
      {filteredGames.length > 0 ? (
        filteredGames
          .slice()
          .sort((a: any, b: any) => b.gameId - a.gameId)
          .map((game: any) => (
            <MyGameCard key={game.gameId} {...game} gameType={gameType} />
          ))
      ) : (
        <p className={styles.noGames}>You have no games in this section</p>
      )}
    </div>
  );
};

import React, { memo } from 'react';
import { JoinGameListPropsI } from './JoinGameListProps';
import styles from './JoinGameList.module.scss';
import { JoinGameCard } from '../JoinGameCard';

export const JoinGameList: React.FC<JoinGameListPropsI> = memo(
  ({ gameType, onClick, dataToShow }) => {
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
  }
);

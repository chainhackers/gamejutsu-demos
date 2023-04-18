import React from 'react';
import { MyGamesPropsI } from './MyGamesProps';
import styles from './MyGames.module.scss';
import { GameInfo } from '../GameInfo';
import { MyGameCard } from '../MyGameCard';

export const MyGames: React.FC<MyGamesPropsI> = ({ games }) => {
  return (
    <div>
      {games &&
        games.map((game, index) => {
          return (
            <div className={styles.game}>
              <GameInfo
                key={game.name + index}
                {...game}
                name={game.name}
                url={game.url}
              />
              <MyGameCard key={game.name + index} />
            </div>
          );
        })}
    </div>
  );
};

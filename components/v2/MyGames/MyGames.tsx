import React from 'react';
import { MyGamesPropsI } from './MyGamesProps';
import styles from './MyGames.module.scss';
import { GameInfo } from '../GameInfo';
import { MyGamesList } from './MyGamesList';
import { TGameType } from 'types/game';

export const MyGames: React.FC<MyGamesPropsI> = ({ games }) => {
  return (
    <div>
      {games?.map((gameInfo) => {
        const gameType = gameInfo.url as TGameType;
        return (
          <div key={gameInfo.name}>
            <GameInfo {...gameInfo} />
            <MyGamesList gameType={gameType} />
          </div>
        );
      })}
    </div>
  );
};

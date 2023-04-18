import React from 'react';
import { MyGamesPropsI } from './MyGamesProps';
import { GameCard } from 'components/v2/GameCard/GameCard';
import styles from './MyGames.module.scss';
import { GameInfo } from '../GameInfo';

export const MyGames: React.FC<MyGamesPropsI> = ({ games }) => {
  return (
    <div>
      <div className={styles.game}>
        <GameInfo />
        <GameCard />
      </div>
    </div>
  );
};

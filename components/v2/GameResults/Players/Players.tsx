import { PlayersPropsI } from './PlayersProps';
import React from 'react';
import styles from './Players.module.scss';
import { PlayerCard } from './PlayerCard';

export const Players: React.FC<PlayersPropsI> = () => {
  const players = [
    {
      address: '1',
      status: 'won',
    },
    {
      address: '2',
      status: 'lose',
    },
  ];
  return (
    <div className={styles.container}>
      {players &&
        players.map((player) => (
          <PlayerCard key={player.address} player={player} />
        ))}
    </div>
  );
};

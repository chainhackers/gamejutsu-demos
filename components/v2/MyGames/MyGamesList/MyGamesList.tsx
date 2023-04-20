import React, { useEffect, useState } from 'react';
import { MyGamesListPropsI } from './MyGamesListProps';
import styles from './MyGames.module.scss';
import { MyGameCard } from '../../MyGameCard';
import gameList from '../../../../data/gameList.json';
import { getRulesContract } from 'gameApi';

export const MyGamesList: React.FC<MyGamesListPropsI> = ({ gameType }) => {
  const myAddress = '0x123';
  const myGames = gameList.filter((game) => game.proposer === myAddress);

  const [rulesAddress, setRulesAddress] = useState('');
  const myFilteredGames = myGames.filter((game) => game.rules === rulesAddress);
  useEffect(() => {
    getRulesContract(gameType).then((response) => {
      setRulesAddress(response.address);
    });
  }, []);

  return (
    <div>
      {myFilteredGames.map((game) => (
        <MyGameCard
          key={game.id}
          id={game.id}
          stake={game.stake}
          proposer={game.proposer}
          rules={game.rules}
        />
      ))}
    </div>
  );
};

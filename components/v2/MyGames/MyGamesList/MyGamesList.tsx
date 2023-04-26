import React, { useEffect, useState } from 'react';
import { MyGamesListPropsI } from './MyGamesListProps';
import styles from './MyGamesList.module.scss';
import { MyGameCard } from '../../MyGameCard';
import gameList from '../../../../__fixtures__/gameList.json';
import { getRulesContract } from 'gameApi';
import {shortenAddress} from 'helpers/utils';

export const MyGamesList: React.FC<MyGamesListPropsI> = ({ gameType }) => {
  const myAddress = '0xdC5f32DEc4253Bd61092294B45AfB834C0BD2938';
  const myGames = gameList.filter((game) => game.proposer === myAddress);

  const [rulesAddress, setRulesAddress] = useState('');
  const myFilteredGames = myGames.filter((game) => game.rules === rulesAddress);
  useEffect(() => {
    getRulesContract(gameType).then((response) => {
      setRulesAddress(response.address);
    });
  }, []);

  return (
    <div className={styles.gamesList}>
      {myFilteredGames.map((game) => (
        <MyGameCard
          key={game.id}
          id={game.id}
          stake={game.stake}
          proposer={shortenAddress(game.proposer)}
          rules={game.rules}
        />
      ))}
    </div>
  );
};

import { getRulesContract } from 'gameApi';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TGameType } from 'types/game';
import { GameInfoPropsI } from './GameInfoProps';
import styles from './GameInfo.module.scss';

export const GameInfo: React.FC<GameInfoPropsI> = ({ name, image, url }) => {
  const { t } = useTranslation();
  const [rulesAddress, setRulesAddress] = useState('');

  const gameName = t(`gameTypePage.games.${name}`);
  const game = url as TGameType;

  function shortenAddress(str: string) {
    return str.slice(0, 5) + '...' + str.slice(-4);
  }

  useEffect(() => {
    getRulesContract(game).then((response) => {
      setRulesAddress(shortenAddress(response.address));
    });
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <img src={image} alt="game icon" />
      </div>
      <div className={styles.cardInfo}>
        <div className={styles.name}>{gameName}</div>
        <div className={styles.address}>{rulesAddress}</div>
      </div>
    </div>
  );
};

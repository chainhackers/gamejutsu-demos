import { getRulesContract } from 'gameApi';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TGameType } from 'types/game';
import { GameInfoPropsI } from './GameInfoProps';
import styles from './GameInfo.module.scss';
import Blockies from 'react-blockies';
import {shortenAddress} from 'helpers/utils';

export const GameInfo: React.FC<GameInfoPropsI> = ({ name, image, url }) => {
  const { t } = useTranslation();
  const [rulesAddress, setRulesAddress] = useState('');

  const gameName = t(`gameTypePage.games.${name}`);
  const game = url as TGameType;


  useEffect(() => {
    getRulesContract(game).then((response) => {
      setRulesAddress(response.address);
    });
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <img src={image} alt="game icon" />
      </div>
      <div className={styles.cardInfo}>
        <div className={styles.name}>{gameName}</div>
        <div className={styles.address}>
          <Blockies
            seed={!!rulesAddress ? rulesAddress : '0x00000000000'}
            size={5}
            className="rounded-full"
          />
          <div className={styles.rulesAddress}>
            {shortenAddress(rulesAddress)}
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { GameResult } from 'components/GameResult';
import { TGameType } from 'types/game';
import styles from './gameResult.module.scss';
import { FinishedGameState, getArbiter, getPlayers } from 'gameApi/index';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import gameApi from 'gameApi/index';
import { BigNumber, Contract } from 'ethers';
const GameResultPage = () => {

  return (
    <div className={styles.wrapper}>
      
    </div>
  );
};

export default GameResultPage;

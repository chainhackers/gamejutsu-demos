import React from 'react';
import styles from './ScoreCard.module.scss';
import { IScoreCardProps } from './ScoreCardProps';
import Image from 'next/image';
import playerImg from 'public/images/empty_avatar.png';
import Blockies from 'react-blockies';
import empty_avatar from '../../../public/images/empty_avatar.png';

export const ScoreCard: React.FC<IScoreCardProps> = ({
  playerResult,
  finishResult,
  showWinText,
}) => {
  const { address, playerType, moves } = playerResult;
  // const address = playerResult!.players
  // const moves = playerResult!.players
  // const playerType = playerResult!.players
  console.log('SCORE CARD log playerType', playerType)
  console.log('SCORE CARD log address', address)
  console.log('SCORE CARD log address', moves)
  const truncatedAddress = address ? address.slice(0, 5) + '...' + address.slice(-5) : null;
  return (
    <div className={`${styles.container}`}>
      <div
        className={`${styles.card} ${moves === true ? styles.highlight : ''} ${
          finishResult?.winner === true ? styles.highlight : ''
        }`}>
        {finishResult?.winner === true && showWinText && (
          <p className={styles.titleColor}>Winner!</p>
        )}
        <div className={styles.containerPlayer}>
          {address ? (
            <Blockies
              seed={!!address ? address : '0x00000000000'}
              size={10}
              className='rounded-full'
            />
          ) : (
            <Image src={playerImg.src} alt='Player' width={24} height={24} />
          )}

          {address ? (
            <div className={styles.playerData}>
              {/*<div className={styles.name}>{playerName}&nbsp;{moves && (<span className={styles.move}>move</span>)}</div>*/}
              <p className={styles.addressPlayer}>{truncatedAddress}</p>
            </div>
          ) : (
            <div className={styles.playerData}>Waiting...</div>
          )}
        </div>
        <div className={styles.playerType}>{playerType}</div>
      </div>
    </div>
  );
};

import { PlayerCardPropsI } from './PlayerCardProps';
import React from 'react';
import styles from './PlayerCard.module.scss';
import Blockies from 'react-blockies';
import cn from 'classnames';

export const PlayerCard: React.FC<PlayerCardPropsI> = ({ player }) => {
  const playerAddress = '0xdc5f32dec4253bd61092294b45afb834c0bd2937';

  return (
    <div
      className={cn(styles.card, {
        [styles.winnerCard]: player.status === 'won',
      })}
    >
      {player.status === 'won' && <p className={styles.winner}>Winner!</p>}
      <div className={styles.row}>
        <Blockies
          seed={!!playerAddress ? playerAddress : '0x00000000000'}
          size={6}
          className='rounded-full'
        />
        <p className={styles.address}>0xh20...7260</p>
      </div>
    </div>
  );
};

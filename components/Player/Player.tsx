import Image from 'next/image';
import Blockies from 'react-blockies';
import empty_avatar from 'public/images/empty_avatar.png';
import { PlayerPropsI } from './PlayerProps';
import styles from './Player.module.scss';
import React from 'react';

export const Player: React.FC<PlayerPropsI> = ({
  playerName,
  address,
  playerType,
  avatarUrl,
  moves,
}) => {
  // const address = '0x1215991085d541A586F0e1968355A36E58C9b2b4';
  const truncatedAddress = address ? address.slice(0, 5) + '...' + address.slice(-5) : null;
  console.log('Player TYPE', playerType);
  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${moves === true ? styles.highlight : ''}`}>
        <div className={styles.avatar}>
          {address ? (
            <Blockies
              seed={!!address ? address : '0x00000000000'}
              size={7}
              className={`rounded-full`}
            />
          ) : (
            <Image src={empty_avatar} alt='avatar' width={28} height={28}></Image>
          )}
          {address ? (
            <h2 className={styles.address}>{truncatedAddress}</h2>
          ) : (
            <div className={styles.playerData}>Waiting...</div>
          )}
        </div>
        {playerType}
      </div>
    </div>
  );
};

// export const ScoreCard = (props: ScoreCardProps) => {
//     const { playerImg, showWinText, icon, playerIndex, players, finishGameCheckResult } = props;
//     const playerData = players ? players[playerIndex] : null;
//     return (
//         <div className={`${styles.container}`}>
//             <div className={`${styles.card} ${finishGameCheckResult?.winner === true ? styles.highlight : ''}`}>
//                 {finishGameCheckResult?.winner === true && showWinText && <p className={styles.titleColor}>Winner!</p>}
//                 <div className={styles.containerPlayer}>
//                     <Image src={playerImg} alt='Player' width={24} height={24} />
//                     <p className={styles.addressPlayer}>{playerData?.playerName}</p>
//                     {icon}
//                 </div>
//             </div>
//         </div>
//     );
// };

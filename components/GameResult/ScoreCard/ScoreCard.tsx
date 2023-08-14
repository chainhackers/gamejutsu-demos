import styles from './ScoreCard.module.scss';
import { ScoreCardProps } from './ScoreCardProps';
import Image from 'next/image';
import { BigNumber } from 'ethers';
import { getPlayers, getArbiterRead } from 'gameApi';
import { useState, useEffect } from 'react';
import { ZERO_ADDRESS } from 'types/constants';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
export const ScoreCard = (props: ScoreCardProps) => {
  const { playerName, result, avatarUrl, showWinText, icon } = props;

  const { query } = useRouter();
  const account = useAccount();
  const gameId = parseInt(query.game as string);
  const [opponentAddress, setOpponentAddress] = useState(null);
  const [playerIngameId, setPlayerIngameId] = useState<0 | 1>(0);

  useEffect(() => {
    const FETCH_OPPONENT_ADDRESS_TIMEOUT = 5000;

    const interval = setInterval(async () => {
      if (opponentAddress) {
        clearInterval(interval);
        return;
      }

      if (!gameId) {
        clearInterval(interval);
        return;
      }

      try {
        const players = await getPlayers(await getArbiterRead(), BigNumber.from(gameId));
        const address = account.address;

        if (!address || !players) {
          clearInterval(interval);
          return;
        }

        if (!(players[0] === ZERO_ADDRESS && players[1] === ZERO_ADDRESS) && !players.includes(address)) {
          throw new Error(`Player ${address} is not in game ${gameId}, players: ${players}`);
        }

        const inGameId = players.indexOf(address) === 0 ? 0 : 1;
        setPlayerIngameId(inGameId);

        let opponent = players[1 - inGameId];
        if (!opponent || opponent === ZERO_ADDRESS) {
          clearInterval(interval);
          return;
        }

        setOpponentAddress(opponent);
        clearInterval(interval);
      } catch (error) {
        console.error('Error fetching opponent address:', error);
      }
    }, FETCH_OPPONENT_ADDRESS_TIMEOUT);

    return () => {
      clearInterval(interval);
    };
  }, [opponentAddress, gameId]);
  console.log('game id', gameId);
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.card} ${result === 'winner' ? styles.highlight : ''}`}>
        {result === 'winner' && showWinText && <p className={styles.titleColor}>Winner!</p>}
        <div className={styles.containerPlayer}>
          <Image src={avatarUrl} alt='Player' width={24} height={24} />
          <p className={styles.addressPlayer}>{playerName[0].playerName}</p>
          {icon}
        </div>
      </div>
    </div>
  );
};

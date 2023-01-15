import cn from 'classnames';
import { ActualGamePropsI } from './ActualGameProps';
import styles from './ActualGame.module.scss';
import { useRouter } from 'next/router';
export const ActualGame: React.FC<ActualGamePropsI> = ({
  gameId,
  winner,
  loser,
  header,
  onClick,
  stake,
  proposer,
  rules,
}) => {
  const router = useRouter();
  const gameType = router.query.gameType as string
  
  function formattedGameType() {
    if (rules !== 'game rules') {
      let formattedGameType = gameType.split('-')
    let newArr = ''
    formattedGameType.forEach(word => {
      newArr = newArr + (word[0].toUpperCase() + word.slice(1) + ' ')  
    });
    return newArr.trim()
    } else return rules
    
  }
  return (
    <div
      className={cn(styles.container, header ? styles.header : null)}
      onClick={onClick ? () => onClick(gameId, stake) : undefined}
    >
      <div className={styles.id}>{gameId}</div>
      <div className={styles.stake}>
        {stake === 'stake' ? stake : String(Number(stake) / 1000000000000000000)}
      </div>
      <div className={styles.proposer}>{proposer}</div>
      <div className={styles.rules}>
      {formattedGameType()}
      </div>
    </div>
  );
};

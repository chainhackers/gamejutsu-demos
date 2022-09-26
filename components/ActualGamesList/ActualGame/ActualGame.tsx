import cn from 'classnames';
import { ActualGamePropsI } from './ActualGameProps';
import styles from './ActualGame.module.scss';
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
        {rules === '0xc6f81d6610a0b1bcb8cc11d50602d490b7624a96' ? 'Tic-Tac-Toe' : rules}
      </div>
    </div>
  );
};

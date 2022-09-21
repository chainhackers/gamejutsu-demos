import cn from 'classnames';
import { ActualGamePropsI } from './ActualGameProps';
import styles from './ActualGame.module.scss';
export const ActualGame: React.FC<ActualGamePropsI> = ({
  gameId,
  winner,
  loser,
  header,
  onClick,
}) => {
  return (
    <div
      className={cn(styles.container, header ? styles.header : null)}
      onClick={onClick ? () => onClick(gameId) : undefined}
    >
      <div className={styles.id}>{gameId}</div>
      <div className={styles.winner}>{winner ? winner : 'n/a'}</div>
      <div className={styles.loser}>{loser ? loser : 'n/a'}</div>
    </div>
  );
};

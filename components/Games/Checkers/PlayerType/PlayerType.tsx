import cn from 'classnames'
import { IPlayerTypeProps } from './PlayerTypeProps';
import styles from './PlayerType.module.scss';

export const PlayerType: React.FC<IPlayerTypeProps> = ({playerIngameId}) => {
  return <div className={cn(styles.container, playerIngameId === 0 ? styles.white : styles.red)}></div>
}

import cn from 'classnames';
import { IPlayerTypeProps } from './PlayerTypeProps';
import styles from './PlayerType.module.scss';
import { classNames } from 'components/Conversation/helpers';

export const PlayerType: React.FC<IPlayerTypeProps> = ({ playerIngameId }) => {
  // {playerIngameId === 0 ? 'X' : 'O'}
  return <div className={cn(styles.container, playerIngameId === 0 ? styles.cross : styles.round)}></div>
};

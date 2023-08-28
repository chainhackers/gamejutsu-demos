import cn from 'classnames';
import { IPlayerTypeProps } from './PlayerTypeProps';
import styles from './PlayerType.module.scss';
import { classNames } from 'components/Conversation/helpers';
import {OIcon, XIcon} from "../../../shared/ui/XOIcons";

export const PlayerType: React.FC<IPlayerTypeProps> = ({ playerIngameId }) => {
  // TODO: clear @habdevs #190
  // {playerIngameId === 0 ? 'X' : 'O'}
  // return <div className={cn(styles.container, playerIngameId === 0 ? styles.cross : styles.round)}></div>
  // return <div className={cn(styles.container, playerIngameId === 0 ? <XIcon/> : <OIcon/> )}></div>
  // return {playerIngameId === 0 ? <XIcon /> : <OIcon />}
  return(
    <div
      className={cn(styles.container, {
        // [styles.cross]: playerIngameId === 0,
        // [styles.round]: playerIngameId === 1,
      })}
    >
      {playerIngameId === 0 ? <XIcon /> : <OIcon />}
    </div>
  )
};

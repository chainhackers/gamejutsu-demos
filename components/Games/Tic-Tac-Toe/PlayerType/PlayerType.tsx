import cn from 'classnames';
import { IPlayerTypeProps } from './PlayerTypeProps';
import styles from './PlayerType.module.scss';
import { classNames } from 'components/Conversation/helpers';
import {OIcon, XIcon} from "../../../shared/ui/XOIcons";

export const PlayerType: React.FC<IPlayerTypeProps> = ({ playerIngameId }) => {
  // TODO: clear @habdevs #190
  return(
    <div
      className={cn(styles.container, {
      })}
    >
      {playerIngameId === 0 ? <XIcon width={60} height={60}/> : <OIcon width={60} height={60}/>}
    </div>
  )
};

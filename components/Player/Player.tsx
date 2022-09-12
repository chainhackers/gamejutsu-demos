import { PlayerPropsI } from './PlayerProps';
import styles from './Player.module.scss';
export const Player: React.FC<PlayerPropsI> = ({children}) => {
  return <div className={styles.container}>{children}</div>;
};

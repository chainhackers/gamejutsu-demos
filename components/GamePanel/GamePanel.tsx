import { IGamePanelProps } from './GamePanelProps';
import styles from './GamePanel.module.scss';
export const GamePanel: React.FC<IGamePanelProps> = ({children}) => {
  return <div className={styles.container}>{children}</div>
}

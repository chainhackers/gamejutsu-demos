import { RightPanelPropsI } from './RightPanelProps';
import styles from './RightPanel.module.scss';
export const RightPanel: React.FC<RightPanelPropsI> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

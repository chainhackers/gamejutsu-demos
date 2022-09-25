import { ViewerPropsI } from './ViewerProps';
import styles from './Viewer.module.scss';
export const Viewer: React.FC<ViewerPropsI> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

import { IDisclaimerNoticeProps } from './DisclaimerNoticeProps';
import styles from './DisclaimerNotice.module.scss';
import { GamePanel } from 'components/GamePanel';

export const DisclaimerNotice: React.FC<IDisclaimerNoticeProps> = ({children}) => {
  return (
    <div className={styles.container}><GamePanel>{children}
    <span className={styles.hint}>!</span></GamePanel></div>);
}
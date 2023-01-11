import { IDisclaimerProps } from './DisclaimerProps';
import styles from './Disclaimer.module.scss';
import { GamePanel } from 'components/GamePanel';

export const Disclaimer: React.FC<IDisclaimerProps> = ({children}) => {
  return (
    <div id="disclaimer" className={styles.container}>
      <GamePanel>{children}</GamePanel>
    </div>
  )
}
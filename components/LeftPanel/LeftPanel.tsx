import { Players } from 'components';
import { LeftPanelPropsI } from './LeftPanelProps';
import styles from './LeftPanel.module.scss';
export const LeftPanel: React.FC<LeftPanelPropsI> = ({ players }) => {


  return (
    <div className={styles.container}>
      <Players player1={players[0]} player2={players[1]} />
    </div>
  );
};
